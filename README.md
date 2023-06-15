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

1. Visitor: You can browse information in the website without registration.
2. User: Beside browsing, you can also share your camping experiences and photos after log in.
3. Administrator: You can delete members' s messages, review added campsites member provided and edit information.

### 1. Visitor side

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
![](/public/stylesheets/relate-albums.PNG)

Leave a message to rank the campsite or record thoughts if you log in. 
![](/public/stylesheets/messages.PNG)




#### Album information

Click on the album to see album's photos.
![](/public/stylesheets/album-title.PNG)
![](/public/stylesheets/album-photo.PNG)


### 2. User side

Log in and click on `sharing`.
![](/public/stylesheets/add-button.PNG)

#### Create albums

Fill in the album's name and description, and add photos in it.
![](/public/stylesheets/add-album.PNG)



#### Create campsties

Fill in the information for creating the campsite. 

![](/public/stylesheets/add-campsite.PNG)

Or search campsites by google map, the information will fill in automatically.

![](/public/stylesheets/google-map.PNG)

> The administrator have the authority to edit the submitted data.


### 3. Administrator side

Default administrator account:

| Name  |  Password |                                                                                                                                               
| ----- |---------- | 
| root@example.com  | 12345678  |


Log in administrator account and click on `Backstage`.
![](/public/stylesheets/admin.PNG)

#### Campsites page

![](/public/stylesheets/admin-campsites.PNG)


#### Users page

![](/public/stylesheets/admin-users.PNG)

## Development


* It's simple to run `camping-note` on your local computer.  
* The following is step-by-step instruction.
* 
### 1. Get started

```
$ git clone https://github.com/Rae-Lee/camping-note.git
$ cd camping-note
$ npm install
```

### 2. Connect to `MongoDB Altas`

Register in [MongoDB Altas](https://www.mongodb.com/atlas/database) and create a cluster.

Copy the cluster URL and paste on `MONGODB_URL` in `.env.example`.

### 3. Fill in `.env.example` 

Register in [Google Maps Platform](https://developers.google.com/maps) and [Imgur](https://imgur.com/) to get `ID`.
Add `GOOGLE_KEY`, `IMGUR_CLIENT_ID` to `.env.example`.

### 4. Run migrations and seeders

```
$ npm run seed
```

### 5. Run the application

```
$ npm run dev
```
Execute successfully if seeing following message
```
It is running on http://localhost:3000
```

> Or just run docker compose.
```
$ docker-compose up -d
```

## License

MIT © [rae-lee](https://github.com/rae-lee)
