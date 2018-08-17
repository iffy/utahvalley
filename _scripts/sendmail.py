import requests
import os
import click
import json
import cgi
# import datetime
from bs4 import BeautifulSoup

TEMPLATE_ID=419529

class Doer(object):

    def session(self):
        s = requests.session()
        s.auth = ('anything', API_KEY)
        return s

    def scrape(self, url):
        body = requests.get(url).text
        soup = BeautifulSoup(body, 'html.parser')
        thedate = soup.find(id="this-week-date").text
        thisweeklistings = soup.find(id='this-week-listings')
        items = []
        for child in thisweeklistings.children:
            # print child
            # print list(child.children)
            if not hasattr(child, 'attrs'):
                continue
            order = long(child.attrs['data-order'])

            name = None
            href = None
            for td in child.children:
                try:
                    if 'name' in td.attrs.get('class'):
                        name = td.text.strip()
                        href = td.find('a').attrs['href']
                except:
                    pass
            
            item = {
                'order': order,
                'content': '<li><a href="{href}" class="mc-template-link">{title}</a></li>'.format(
                    href=cgi.escape(href),
                    title=cgi.escape(name),
                ),
            }
            items.append(item)
        items = sorted(items, key=lambda x:x['order'])
        newbody = '<ul>' + '\n'.join([x['content'] for x in items]) + '</ul>'
        return {
            "date": thedate,
            "body": newbody,
        }

    def makecampaign(self, template_id, list_id, date):
        s = self.session()
        r = s.get(API_ROOT + '/')
        if not r.ok:
            raise Exception('Authentication failed?', r.text)
        r = s.post(API_ROOT + '/campaigns', json={
            "type": "regular",
            "recipients": {
                "list_id": list_id,
            },
            "settings": {
                "subject_line": "mattslist - {0}".format(date),
                "title": "mattslist - {0}".format(date),
                "from_name": "Matt",
                "reply_to": "haggardii+uv@gmail.com",
                "template_id": template_id,
            },
        })
        if not r.ok:
            raise Exception('Failed to create campaign: {0}'.format(r.text))
        campaign_id = r.json()['id']
        return campaign_id

    def send(self, campaign_id):
        s = self.session()
        r = s.post(API_ROOT + '/campaigns/{0}/actions/send'.format(campaign_id))
        if not r.ok:
            raise Exception('Error sending')

    def updatecampaigncontent(self, campaign_id, template_id, date, body):
        s = self.session()
        r = s.put(API_ROOT + '/campaigns/{0}/content'.format(campaign_id), json={
                "template": {
                    "id": template_id,
                    "sections": {
                        "date": date,
                        "body": body,
                    }
                },
            })
        if not r.ok:
            raise Exception('Failed to update campaign content: {0}'.format(r.text))
        return campaign_id


API_ROOT = 'https://us8.api.mailchimp.com/3.0'
API_KEY = os.environ.get('MAILCHIMP_API_KEY', '')

@click.group()
def cli():
    pass


@cli.command()
def lists():
    doer = Doer()
    s = doer.session()
    r = s.get(API_ROOT + '/lists')
    for item in r.json()['lists']:
        print '{0} - {1} ({2} subscribers)'.format(item['id'], item['name'], item['stats']['member_count'])

@cli.command()
def templates():
    doer = Doer()
    s = doer.session()
    r = s.get(API_ROOT + '/templates')
    for item in r.json()['templates']:
        print '{0} - {1}'.format(item['id'], item['name'])

@cli.command()
@click.argument('path')
def get(path):
    doer = Doer()
    s = doer.session()
    r = s.get(API_ROOT + path)
    print json.dumps(r.json(), indent=2)

@cli.command()
@click.option('-u', '--url',
    default='http://fun.iffycan.com')
def scrape(url):
    doer = Doer()
    result = doer.scrape(url)
    print json.dumps(result, indent=2)


@cli.command()
@click.option('-t', '--template-id',
    default=TEMPLATE_ID, # mattslist weekly custom
    type=int)
@click.option('-L', '--list-id',
    default='35bd063b0a', # test list
)
@click.option('-d', '--date',
    default='TEST DATE')
@click.option('-b', '--body',
    default='TEST BODY')
@click.option('-u', '--url',
    default=None)
@click.option('--send',
    is_flag=True)
def makecampaign(template_id, list_id, date, body, url, send=False):
    doer = Doer()

    if url:
        print 'Scraping:', url
        scraped = doer.scrape(url)
        date = scraped['date']
        body = scraped['body']

    campaign_id = doer.makecampaign(
        template_id=template_id,
        list_id=list_id,
        date=date,
    )
    print 'Campaign:', campaign_id
    doer.updatecampaigncontent(
        campaign_id=campaign_id,
        template_id=template_id,
        date=date,
        body=body,
    )

    if send:
        print 'Sending'
        doer.send(campaign_id)

@cli.command()
@click.option('-t', '--template-id',
    default=TEMPLATE_ID, # mattslist weekly
    type=int)
@click.option('-C', '--campaign-id')
@click.option('-d', '--date',
    default='TEST DATE')
@click.option('-b', '--body',
    default='TEST BODY')
def updatecampaign(template_id, campaign_id, date, body):
    doer = Doer()
    doer.updatecampaigncontent(
        campaign_id=campaign_id,
        template_id=template_id,
        date=date,
        body=body,
    )



if __name__ == '__main__':
    cli()
