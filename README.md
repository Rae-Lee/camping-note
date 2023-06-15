<p align=center>
<img src="https://raw.githubusercontent.com/Rae-Lee/camping-note/main/logo.PNG">
</p>
<p align=center>
<a target="_blank" href="http://nodejs.org/download/" title="Node version"><img src="https://img.shields.io/badge/node.js-%3E=_6.0-green.svg"></a>
<a target="_blank" href="https://opensource.org/licenses/MIT" title="License: MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
<a target="_blank" href="http://makeapullrequest.com" title="PRs Welcome"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
</p>



> The best sharing platform for exchanging camping information!

Providing information about campsites and nearby attractions, establishing a comprehensive database of taiwan campsites. 

Share camping experiences and photos, and create a safe and transparent camping environment!"

Website: https://camping-note-jmdw2t6f2q-uc.a.run.app

Default account:

| Email  |  Password |                                                                                                                                               
| ----- |---------- | 
| user1@example.com | 12345678  |
| user2@example.com | 12345678  |


Law data came from [政府資料開放平台](https://data.gov.tw/dataset/132066) csv files.


## :flower_playing_cards: Usage

`camping-note` provides multiple identity verification:

1. User: You can browse information in the website without registration.
2. Member: Beside browsing, you can also share your camping experiences and photos after log in.
3. Administrator: You can delete members' s messages, review added campsites member provided and edit information.

### 1. User side

#### Homepage

There are four tabs in homepage.(`All`, `Feed albums`, `Hot albums`, `Top 10 campsites`)

Search for campsites or county/town or just click on the desired campingsites category in `All` tabs.

Also click on the county or township `tags` to view campsites in a specific region.
![](/public/stylesheets/homepage.PNG)

All campsites are arranged in order of view counts.

In `Feed albums` tab displays recently created albums, and the most viewed albums are displayed in `Hot albums` tab.
![](/public/stylesheets/feed-albums.PNG)

Top 10 campsites leaderboard is in `Top 10 campsites` tab.
![](/public/stylesheets/top-campsites.PNG)


#### Campsite information

Click on the campsite to see more information.
![](/public/stylesheets/campsite.PNG)

You can also browse other members' albums and messages about this campsite in the same page.
Leave a message to rank the campsite or record thoughts if you log in. 
![](/public/stylesheets/relate-albums.PNG)
![](/public/stylesheets/messages.PNG)

#### Album information

Click on the album to see album's photos.
![](/public/stylesheets/album-title.PNG)
![](/public/stylesheets/album-photo.PNG)

### 2. Member side

### 3. Administrator side

Default administrator account:

| Name  |  Password |                                                                                                                                               
| ----- |---------- | 
| root@example.com  | 12345678  |




## Development


* It's simple to run `Legal-Dictionary` on your local computer.  
* The following is step-by-step instruction.

```
$ git clone https://github.com/Rae-Lee/Legal-Dictionary-Frontend.git
$ cd Legal-Dictionary-Frontend
$ npm install
$ npm run start
```

## License

MIT © [rae-lee](https://github.com/rae-lee)
