
//const videoId = "kw6SFbbinnY";

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('videoId');

const dataApi_key = "AIzaSyBTUisDfX82CjIAJYBp-774yBR41p31Btk";
const baseUrl = `https://www.googleapis.com/youtube/v3/videos?id=`;
const oldKey = "AIzaSyAQNFuK_xjHRCozEHo0_5sktC7UE-HGIaI";
const newKey="AIzaSyCTD2aJJrfQ06-dh5wwUuKZwGdH8tmvKUM";

const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=`;
const commentUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${10}&key=${newKey}`;
const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${newKey}&maxResults=33`;


const container = document.getElementsByClassName("container")[0];
const commentContainer = document.createElement("div");
commentContainer.className = "comment-container";

const sideBar = document.getElementsByClassName("side-bar")[0];
const sideContainer = document.createElement("div");
sideContainer.className = "side-container";



//for videoplayer
async function getVideo(videoId) {
    const videoContainer = document.createElement("div");
    videoContainer.className = "video-container";
    const videoUrl = `${baseUrl}${videoId}&key=${newKey}&part=snippet,contentDetails,statistics,status`;

    const response = await fetch(videoUrl);
    const result = await response.json();
    //console.log(result);
   const snippet=result.items[0].snippet;
  //console.log(snippet);
    const videoTitle = snippet.title;
    const views = result.items[0].statistics.viewCount;
    const likes = result.items[0].statistics.likeCount;

    const description = snippet.localized.description;
    const lines = description.split('\n');

    const videoTime = convertTime(snippet.publishedAt);


    const channelId = snippet.channelId;
    //channel details

    const channelSnippet = await getChannelData(channelId);
    //const channelSnippet = channelData.snippet;

    const channelName = channelSnippet.title;
    const subscriberCount = channelData.statistics.subscriberCount;
    const channelImageUrl = channelSnippet.thumbnails.medium.url;
    const channelDescription = channelSnippet.description;





    videoContainer.innerHTML = ` 
    <div class="video-container">
    <div class="top-title"><span>${videoTitle}</span></div>
    <iframe  src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen ></iframe>
    <div class="controls">
        <div class="timeline">


        </div>
        <div class="control-buttons">
            <div class="control-left">
                <span id="play-button" class="material-symbols-outlined icons" style="font-size: 30px;">
                    play_arrow
                </span>
                <span id="skip-next" class="material-symbols-outlined icons" style="font-size: 30px;">
                    skip_next
                </span>
                <div class="volume-container">
                    <span class="material-symbols-outlined" id="volume-button" style="font-size: 30px;">
                        volume_down_alt
                    </span>
                    <input type="range" id="volume" name="volume" min="0" max="100" step="1" value="50">
                </div>
                <div class="time">
                    <span class="current-time">1:09 </span><span>/</span>
                    <span class="duraion">7:00</span>
                </div>


            </div>

            <div class="control-right">
                <span class="material-symbols-outlined" style="font-size: 28px; ">
                    settings
                </span>
                <span class="material-symbols-outlined" style="font-size: 30px; font-weight: 500;">
                    fullscreen
                </span>
            </div>
        </div>
    </div>
</div>

<div class="video-title">
    <span>${videoTitle}</span>
</div>
<div class="statistics">
    <div class="view-details">
        <span class="view-count">${convertCount(views)} views</span>
        <div class="dot"><span class="material-symbols-outlined"
                style="color: #AAAAAA; font-size: 5px;">circle</span></div>
        <span class="date">${videoTime}</span>
    </div>
    <div class="likes">
        <div class="items">
            <span class="material-symbols-outlined">
                thumb_up
            </span>
            <span class="data">${convertCount(likes)}</span>
        </div>
        <div class="items">
            <span class="material-symbols-outlined">
                thumb_down
            </span>
            <span class="data"></span>
        </div>
        <div class="items">
            <span class="material-symbols-outlined">
                share
            </span>
            <span class="data"></span>
        </div>
        <div class="items">
            <span class="material-symbols-outlined">
                playlist_Add
            </span>
            <span class="data"></span>
        </div>
        <div class="items">
            <span class="material-symbols-outlined">

            </span>
            <span class="data">SAVE</span>
        </div>
        <div class="items">
            <span class="material-symbols-outlined">
                more_vert
            </span>
            <span class="data"></span>
        </div>
    </div>
</div>

<div class="channel">

    <div class="channel-logo">
        <img src="${channelImageUrl}" alt="">
    </div>
    <div class="channel-details">
        <div class="main-details">
            <div class="name">
                <span class="channel-name">
                    ${channelName}
                </span>
                <span class="subscribers">
                    ${convertCount(subscriberCount)} subscribers
                </span>
            </div>
            <div class="subscribe">
                <button>SUBSCRIBE</button>
            </div>
        </div>
        <div class="channel-description">
          
        </div>
        <button class="show-more-button">SHOW MORE</button>
    </div>
    </div>`;


    container.appendChild(videoContainer);



    //for toggle show more show less


    const showMoreButton = document.getElementsByClassName("show-more-button")[0];
    const descriptionContainer = document.querySelector('.channel-description');
    if (lines.length > 3) {
        showMoreButton.style.display = "block";
        for (let i = 0; i < 3; i++) {
            const paragraph = document.createElement('p');
            paragraph.innerText = lines[i].trim();
            descriptionContainer.appendChild(paragraph);
        }
    }
    else {
        showMoreButton.style.display = "none";
        for (let i = 0; i < lines.length; i++) {
            const paragraph = document.createElement('p');
            paragraph.innerText = lines[i].trim();
            descriptionContainer.appendChild(paragraph);
        }

    }
    function toggleShowMore() {
        if (showMoreButton.innerText === "SHOW MORE") {
            descriptionContainer.innerHTML = "";
            for (let i = 0; i < lines.length; i++) {
                const paragraph = document.createElement('p');
                paragraph.innerText = lines[i].trim();
                descriptionContainer.appendChild(paragraph);
            }
            showMoreButton.innerText = "SHOW LESS"
        }
        else {
            descriptionContainer.innerHTML = "";
            for (let i = 0; i < 3; i++) {
                const paragraph = document.createElement('p');
                paragraph.innerText = lines[i].trim();
                descriptionContainer.appendChild(paragraph);
            }
            showMoreButton.innerText = "SHOW MORE"
        }
    }


    showMoreButton.addEventListener("click", toggleShowMore);


    //for adding comments
    const commentData = await getComments();

    const commentBaseHtml = ` <div class="comments-header">
    <span>${commentData.length} Comments</span>
    <span class="material-symbols-outlined">
        sort
    </span>
    <b>SORT BY</b>
</div>
<div class="comments-box">
 <div class="user-comment-box">
    <div class="user-pp">
        <img src="heisen.png" alt="">
    </div>
    <div class="user-comment">
        <input type="text" placeholder="Add a public comment...">
    </div>
  </div>
</div>`;
    commentContainer.innerHTML = commentBaseHtml;
    container.append(commentContainer);
    const commentsBox = document.querySelector(".comments-box");

    commentData.forEach(comment => {
        const commentSnippet = comment.snippet.topLevelComment.snippet;
        const commentText = commentSnippet.textDisplay;
        const commmentOwner = commentSnippet.authorDisplayName;
        const userPpUrl = commentSnippet.authorProfileImageUrl;
        const commentLikes = commentSnippet.likeCount;



        const commentTime = convertTime(commentSnippet.publishedAt);


        const publicCommentBox = document.createElement("div");
        publicCommentBox.className = "public-comment-box";
        publicCommentBox.innerHTML = `
        <div class="user-pp">
            <img src=${userPpUrl} alt="">
        </div>
        <div class="comment-details">
            <div class="comment-name-and-time">
                <div class="comment-owner">
                    <span>${commmentOwner}</span>
                </div>
                <div class="comment-time">
                    <span>${commentTime}</span>
                </div>
            </div>
            <div class="comment-text">
                <span>${commentText}</span>
            </div>
            <div class="comment-statistics">
                <div class="pairs">
                    <span class="material-symbols-outlined" style="font-size: small;">thumb_up</span>
                    <span style="font-size: small;">${commentLikes}</span>
                </div>
                <div class="pairs">
                    <span class="material-symbols-outlined" style="font-size: small;">thumb_down</span>
                    <span style="font-size: small;"></span>
                </div>
                <span id="reply">REPLY</span>
            </div>
        </div>`;

        commentsBox.appendChild(publicCommentBox);



    });

    //for side bar
    const videoArray = await getSearchResult();
    sideContainer.innerHTML=` 
    <div class="side-header">
        <div class="all">All</div>
        <div class="filter-owner"> from ${channelName}</div>
    </div>`;
    sideBar.appendChild(sideContainer);
    videoArray.forEach(async video => {
        

        if (video.id.kind === "youtube#video") {

            const videoBlock=document.createElement("div");
            videoBlock.className="video-block";

            const { snippet } = video;

            const sideVideoId = video.id.videoId;

            const sideVideoUrl = `${baseUrl}${sideVideoId}&key=${dataApi_key}&part=snippet,contentDetails,statistics,status`;

            const response = await fetch(sideVideoUrl);
            const result = await response.json();
            const sideSnippet=result.items[0];
           

            const sideVideoTitle = snippet.title;
            const sideViews =convertCount(result.items[0].statistics.viewCount);
            const sidevideoTime =" "+convertTime(snippet.publishedAt);
            const sideChannelTitle=snippet.channelTitle;
            const sideVideoThumbnail=snippet.thumbnails.medium.url;

            videoBlock.innerHTML=`
            <div class="video-side">
                <a href="videoPage.html?videoId=${sideVideoId}"><img src="${sideVideoThumbnail}" alt=""></a>
            </div>
            <div class="side-video-details">
                <span class="side-title">${sideVideoTitle}</span>
                <span class="side-owner">${sideChannelTitle}</span>
                <div class="side-statistics">
                    <span class="view-count">${sideViews} views </span>
                    <div class="dot"> <span class="material-symbols-outlined"
                            style="color: #AAAAAA; font-size: 5px;"> circle</span></div>
                    <span class="date"> ${sidevideoTime}</span>
                </div>
            </div>`

            sideContainer.appendChild(videoBlock);


            
           
        }


   });








}

//for getting channel details
async function getChannelData(channelId) {
    const channelApiUrl = `${channelUrl}${channelId}&key=${dataApi_key}`;
    const response = await fetch(channelApiUrl, { method: "GET" });
    const result = await response.json();
   
    return result.items[0].snippet;
}

//for getting comments
async function getComments() {
    const response = await fetch(commentUrl, { method: "GET" });
    const data = await response.json();
    console.log(data.items);
    return data.items;
}

//for sidebar videos
async function getSearchResult() {
    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        return searchData.items;
    }
    catch (error) {
        console.error("Error searching for videos:", error);
    }
}


//for converting time to socila media format
function convertTime(publishedTime) {
    const timestamp = new Date(publishedTime).getTime();
    const currentTime = new Date().getTime();



    const timeDiffInSeconds = Math.floor((currentTime - timestamp) / 1000);


    if (timeDiffInSeconds < 60) {
        return `${timeDiffInSeconds} seconds ago`;
    } else if (timeDiffInSeconds < 3600) {
        const minutes = Math.floor(timeDiffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (timeDiffInSeconds < 86400) {
        const hours = Math.floor(timeDiffInSeconds / 3600);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (timeDiffInSeconds < 2592000) {
        const days = Math.floor(timeDiffInSeconds / 86400);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (timeDiffInSeconds < 31536000) {
        const months = Math.floor(timeDiffInSeconds / 2592000);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
        const years = Math.floor(timeDiffInSeconds / 31536000);
        return `${years} ${years === 1 ? "year" : "years"} ago`;
    }

}

function convertCount(number) {
    const SI_SYMBOL = ['', 'k', 'M', 'B', 'T'];


    const isNegative = number < 0;
    if (isNegative) {
        number = Math.abs(number);
    }


    const tier = Math.log10(number) / 3 | 0;
    const suffix = SI_SYMBOL[tier];


    const formattedNumber = (number / Math.pow(1000, tier)).toFixed(1);

    const parts = formattedNumber.split('.');
    if (parts.length === 2 && parts[1] === '0') {
        return (isNegative ? '-' : '') + parts[0] + suffix;
    }


    return (isNegative ? '-' : '') + formattedNumber + suffix;
}


//main function
getVideo(videoId);





/*{
    "kind": "youtube#videoListResponse",
    "etag": "CoDRMKuBJllh1AJRzGxAkXiAzy8",
    "items": [
        {
            "kind": "youtube#video",
            "etag": "wsn2FNoDUUevLlSkv21Tl3C1EEM",
            "id": "kw6SFbbinnY",
            "snippet": {
                "publishedAt": "2023-04-09T12:01:00Z",
                "channelId": "UCn4rEMqKtwBQ6-oEwbd4PcA",
                "title": "Pathu Thala - Nee Singam Dhan Video | Silambarasan TR | A. R Rahman | Gautham Karthik",
                "description": "Movie - Pathu Thala\nNee Singam Dhaan \nSong Composed, Produced and Arranged by A.R.Rahman\nSinger Sid Sriram\nLyrics Vivek\nMusic Supervisor  A.H.Kaashif\nProject Supervisor Karthik Sekaran\n\nMusicians\nPercussion - Krishna Kishore\nFlute - Nikhil Ram\nBrass - Dallas Horns USA \nAdditional Vocals - Sreekanth Hariharan, Aravind Srinivas, Sarath Santhosh, Deepak Blue, Shenbagaraj, Narayanan Ravishankar, Sudharsan Hemaram\nAdditional Programming Nakul Abhyankar, TR Krishna Chetan\nSound Engineers - Panchathan Record inn\nSuresh Permal, Karthik Sekaran, Aravind Crescendo, Suryansh, Satish\nMixed by Nitish R Kumar\nMastered By Suresh Permal\nApple Digital Master Riyasdeen Riyan\nMusicians Coordinator - Samidurai R, Abdul Haiyum, T M Faizudeen\n\nCast: Silambarasan TR, Gautham Karthik, Priya Bhavani Shankar, Gautham Vasudev Menon, Kalaiyarasan, Teejay Arunasalamm, Anu Sithara & Others\n\nProduced by: Jayantilal Gada, K.E.Gnanavelraja \nCo producer - Neha Gnanavelraja\nBanner: Studio Green & Pen Studios \nStudio Green CEO - G. Dhananjayan\nExecutive Producer - A. G. Raja\nDirected by: Obeli.N.Krishna \nDOP: Farook J Basha\nEditor: Praveen KL\nArt: Milan\nDialogue: R.S.Ramakrishnan\nChoreographer - Sandy\nStunt: R.Sakthi Saravanan\nScreenplay: Obeli.N.Krishna \nStory: Narthan\nLyrics: Snekan,Kabilan,Vivek \nCostume Designer: Uthra Menon\nAudiographer: S.Sivakumar\nSound Design: Krishnan Subramanian\nColorist: KS.Rajasekaran \nCG: Nxgen Media\nProduction Executive: Vairam Kumar\nProduction Controller: EV Dinesh Kumar\nStills: V. Sittrarasu\nPublicity Design: Thandora, DSTAGE CLINTON\nPro: Suresh Chandra, Rekha D'one\nDigital Marketing: Digitally\nStudio Green Team: Neha Gnanavelraja , G.Dhananjayan, A.G.Raja\n\nMusic Label - Sony Music Entertainment India Pvt. Ltd.\n\n© 2023 Sony Music Entertainment India Pvt. Ltd.\n\nSubscribe Now: http://bit.ly/SonyMusicSouthVevo\nSubscribe Now: http://bit.ly/SonyMusicSouthYT\nFollow us: https://www.instagram.com/sonymusic_south/\nFollow us: Twitter: https://twitter.com/SonyMusicSouth\nLike us: Facebook: https://www.facebook.com/SonyMusicSouth",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/kw6SFbbinnY/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/kw6SFbbinnY/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/kw6SFbbinnY/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    },
                    "standard": {
                        "url": "https://i.ytimg.com/vi/kw6SFbbinnY/sddefault.jpg",
                        "width": 640,
                        "height": 480
                    },
                    "maxres": {
                        "url": "https://i.ytimg.com/vi/kw6SFbbinnY/maxresdefault.jpg",
                        "width": 1280,
                        "height": 720
                    }
                },
                "channelTitle": "Sony Music South",
                "tags": [
                    "Sony Music South",
                    "Sony Music",
                    "Latest Song",
                    "Tamil song",
                    "Tamil Latest Song",
                    "Tamil Latest Songs 2020",
                    "Tamil Latest Songs 2021",
                    "Latest songs in Tamil",
                    "Songs in Tamil",
                    "Latest Tamil Movies",
                    "Tamil Movie Songs",
                    "Latest Video Songs Tamil",
                    "latest Tamil Love Songs",
                    "Latest Tamil Hit Songs",
                    "Telugu Songs 2021",
                    "New Tamil Songs",
                    "Songs in Telugu",
                    "Telugu Movie Songs",
                    "Video Songs Telugu",
                    "new Telugu Songs"
                ],
                "categoryId": "10",
                "liveBroadcastContent": "none",
                "defaultLanguage": "en-GB",
                "localized": {
                    "title": "Pathu Thala - Nee Singam Dhan Video | Silambarasan TR | A. R Rahman | Gautham Karthik",
                    "description": "Movie - Pathu Thala\nNee Singam Dhaan \nSong Composed, Produced and Arranged by A.R.Rahman\nSinger Sid Sriram\nLyrics Vivek\nMusic Supervisor  A.H.Kaashif\nProject Supervisor Karthik Sekaran\n\nMusicians\nPercussion - Krishna Kishore\nFlute - Nikhil Ram\nBrass - Dallas Horns USA \nAdditional Vocals - Sreekanth Hariharan, Aravind Srinivas, Sarath Santhosh, Deepak Blue, Shenbagaraj, Narayanan Ravishankar, Sudharsan Hemaram\nAdditional Programming Nakul Abhyankar, TR Krishna Chetan\nSound Engineers - Panchathan Record inn\nSuresh Permal, Karthik Sekaran, Aravind Crescendo, Suryansh, Satish\nMixed by Nitish R Kumar\nMastered By Suresh Permal\nApple Digital Master Riyasdeen Riyan\nMusicians Coordinator - Samidurai R, Abdul Haiyum, T M Faizudeen\n\nCast: Silambarasan TR, Gautham Karthik, Priya Bhavani Shankar, Gautham Vasudev Menon, Kalaiyarasan, Teejay Arunasalamm, Anu Sithara & Others\n\nProduced by: Jayantilal Gada, K.E.Gnanavelraja \nCo producer - Neha Gnanavelraja\nBanner: Studio Green & Pen Studios \nStudio Green CEO - G. Dhananjayan\nExecutive Producer - A. G. Raja\nDirected by: Obeli.N.Krishna \nDOP: Farook J Basha\nEditor: Praveen KL\nArt: Milan\nDialogue: R.S.Ramakrishnan\nChoreographer - Sandy\nStunt: R.Sakthi Saravanan\nScreenplay: Obeli.N.Krishna \nStory: Narthan\nLyrics: Snekan,Kabilan,Vivek \nCostume Designer: Uthra Menon\nAudiographer: S.Sivakumar\nSound Design: Krishnan Subramanian\nColorist: KS.Rajasekaran \nCG: Nxgen Media\nProduction Executive: Vairam Kumar\nProduction Controller: EV Dinesh Kumar\nStills: V. Sittrarasu\nPublicity Design: Thandora, DSTAGE CLINTON\nPro: Suresh Chandra, Rekha D'one\nDigital Marketing: Digitally\nStudio Green Team: Neha Gnanavelraja , G.Dhananjayan, A.G.Raja\n\nMusic Label - Sony Music Entertainment India Pvt. Ltd.\n\n© 2023 Sony Music Entertainment India Pvt. Ltd.\n\nSubscribe Now: http://bit.ly/SonyMusicSouthVevo\nSubscribe Now: http://bit.ly/SonyMusicSouthYT\nFollow us: https://www.instagram.com/sonymusic_south/\nFollow us: Twitter: https://twitter.com/SonyMusicSouth\nLike us: Facebook: https://www.facebook.com/SonyMusicSouth"
                },
                "defaultAudioLanguage": "en-IN"
            },
            "contentDetails": {
                "duration": "PT4M13S",
                "dimension": "2d",
                "definition": "hd",
                "caption": "false",
                "licensedContent": true,
                "contentRating": {},
                "projection": "rectangular"
            },
            "status": {
                "uploadStatus": "processed",
                "privacyStatus": "public",
                "license": "youtube",
                "embeddable": true,
                "publicStatsViewable": true,
                "madeForKids": false
            },
            "statistics": {
                "viewCount": "20293554",
                "likeCount": "284489",
                "favoriteCount": "0",
                "commentCount": "4793"
            }
        }
    ],
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
    }
} */

/*
            <div class="video-container">
                <div class="top-title"><span>top title here</span></div>
                <img src="thumbnail.jpg"></img>
                <div class="controls">
                    <div class="timeline">


                    </div>
                    <div class="control-buttons">
                        <div class="control-left">
                            <span id="play-button" class="material-symbols-outlined icons" style="font-size: 30px;">
                                play_arrow
                            </span>
                            <span id="skip-next" class="material-symbols-outlined icons" style="font-size: 30px;">
                                skip_next
                            </span>
                            <div class="volume-container">
                                <span class="material-symbols-outlined" id="volume-button" style="font-size: 30px;">
                                    volume_down_alt
                                </span>
                                <input type="range" id="volume" name="volume" min="0" max="100" step="1" value="50">
                            </div>
                            <div class="time">
                                <span class="current-time">1:09 </span><span>/</span>
                                <span class="duraion">7:00</span>
                            </div>


                        </div>

                        <div class="control-right">
                            <span class="material-symbols-outlined" style="font-size: 28px; ">
                                settings
                            </span>
                            <span class="material-symbols-outlined" style="font-size: 30px; font-weight: 500;">
                                fullscreen
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="video-title">
                <span>Video title here</span>
            </div>
            <div class="statistics">
                <div class="view-details">
                    <span class="view-count">1.3M views </span>
                    <div class="dot"><span class="material-symbols-outlined"
                            style="color: #AAAAAA; font-size: 5px;">circle</span></div>
                    <span class="date"> 1 week ago</span>
                </div>
                <div class="likes">
                    <div class="items">
                        <span class="material-symbols-outlined">
                            thumb_up
                        </span>
                        <span class="data">1.7k</span>
                    </div>
                    <div class="items">
                        <span class="material-symbols-outlined">
                            thumb_down
                        </span>
                        <span class="data">5.6k</span>
                    </div>
                    <div class="items">
                        <span class="material-symbols-outlined">
                            share
                        </span>
                        <span class="data"></span>
                    </div>
                    <div class="items">
                        <span class="material-symbols-outlined">
                            playlist_Add
                        </span>
                        <span class="data"></span>
                    </div>
                    <div class="items">
                        <span class="material-symbols-outlined">

                        </span>
                        <span class="data">SAVE</span>
                    </div>
                    <div class="items">
                        <span class="material-symbols-outlined">
                            more_vert
                        </span>
                        <span class="data"></span>
                    </div>
                </div>
            </div>

            <div class="channel">

                <div class="channel-logo">
                    <img src="channel-logo" alt="">
                </div>
                <div class="channel-details">
                    <div class="main-details">
                        <div class="name">
                            <span class="channel-name">
                                channel name here
                            </span>
                            <span class="subscribers">
                                35.64k subscribers
                            </span>
                        </div>
                        <div class="subscribe">
                            <button>SUBSCRIBE</button>
                        </div>
                    </div>
                    <div class="channel-description">
                        <span>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur reiciendis, minima maiores
                        dolorem aperiam officia neque hic illum architecto dolorum a optio sed nisi reprehenderit
                        doloribus quidem dicta temporibus voluptatibus?Lorem ipsum dolor sit, amet consectetur
                        adipisicing elit. Vitae deleniti dolore non impedit fuga sequi dicta, dolorem at. Similique
                        corporis atque eius temporibus vel accusantium perspiciatis modi minus neque id.
                        </span>
                    </div>
                </div>

            </div>*/


//channel object(result.items[0])
/*[
    {
        "kind": "youtube#channel",
        "etag": "EXj8nHeri4BZiIn0nxUASQnhyEY",
        "id": "UCn4rEMqKtwBQ6-oEwbd4PcA",
        "snippet": {
            "title": "Sony Music South",
            "description": "The official YouTube channel of Sony Music Entertainment India for all the music videos released in Tamil, Telugu , Malayalam & Kannada. Sony Music South is the biggest and the best destination for all the popular and latest music videos - From Love to Kuthu, the best of music is right here at your fingertips!",
            "customUrl": "@sonymusicsouth",
            "publishedAt": "2014-08-06T15:11:11Z",
            "thumbnails": {
                "default": {
                    "url": "https://yt3.ggpht.com/ytc/AOPolaTX9oy0CzPZm0ztNU-r7lt7ElpCflGGPwqMynSj8w=s88-c-k-c0x00ffffff-no-rj",
                    "width": 88,
                    "height": 88
                },
                "medium": {
                    "url": "https://yt3.ggpht.com/ytc/AOPolaTX9oy0CzPZm0ztNU-r7lt7ElpCflGGPwqMynSj8w=s240-c-k-c0x00ffffff-no-rj",
                    "width": 240,
                    "height": 240
                },
                "high": {
                    "url": "https://yt3.ggpht.com/ytc/AOPolaTX9oy0CzPZm0ztNU-r7lt7ElpCflGGPwqMynSj8w=s800-c-k-c0x00ffffff-no-rj",
                    "width": 800,
                    "height": 800
                }
            },
            "localized": {
                "title": "Sony Music South",
                "description": "The official YouTube channel of Sony Music Entertainment India for all the music videos released in Tamil, Telugu , Malayalam & Kannada. Sony Music South is the biggest and the best destination for all the popular and latest music videos - From Love to Kuthu, the best of music is right here at your fingertips!"
            },
            "country": "IN"
        },
        "statistics": {
            "viewCount": "10160239614",
            "subscriberCount": "15200000",
            "hiddenSubscriberCount": false,
            "videoCount": "2779"
        }
    }
] */

/*<div class="comments-container">

    <div class="comments-header">
        <span>286 Comments</span>
        <span class="material-symbols-outlined">
            sort
        </span>
        <b>SORT BY</b>
    </div>
   <div class="comments-box">
    <div class="user-comment-box">
        <div class="user-pp">
            <img src="channel-logo" alt="">
        </div>
        <div class="user-comment">
            <input type="text" placeholder="Add a public comment...">
        </div>
    </div>
    <div class="public-comment-box">
        <div class="user-pp">
            <img src="channel-logo" alt="">
        </div>
        <div class="comment-details">
            <div class="comment-name-and-time">
                <div class="comment-owner">
                    <span>lalo salamanca</span>
                </div>
                <div class="comment-time">
                    <span>8 hours ago</span>
                </div>
            </div>
            <div class="comment-text">
                <span>wonderful video</span>
            </div>
            <div class="comment-statistics">
                <div class="pairs">
                    <span class="material-symbols-outlined" style="font-size: small;">thumb_up</span>
                    <span style="font-size: small;">5</span>
                </div>
                <div class="pairs">
                    <span class="material-symbols-outlined" style="font-size: small;">thumb_down</span>
                    <span style="font-size: small;">5</span>
                </div>
                <span id="reply">REPLY</span>
            </div>
        </div>
    </div>
   </div>
</div> */

//for comment
/*{
"videoId": "kw6SFbbinnY",
"topLevelComment": {
"kind": "youtube#comment",
"etag": "Hjg_4yZkmD0pkjKfcZ0OJPq6QWU",
"id": "UgwfyHLnouAX7T_wwQR4AaABAg",
"snippet": {
"videoId": "kw6SFbbinnY",
"textDisplay": "கடலால் தீராத எரும்பின் தாகங்கள் நிலையின் மேலாடும் பனித்துளி தீர்க்கும்",
"textOriginal": "கடலால் தீராத எரும்பின் தாகங்கள் நிலையின் மேலாடும் பனித்துளி தீர்க்கும்",
"authorDisplayName": "Vincent Manickam",
"authorProfileImageUrl": "https://yt3.ggpht.com/ytc/AOPolaRlu91H8iSl9n1AgTZVyz7QcSkURGDbvDeDgQ=s48-c-k-c0x00ffffff-no-rj",
"authorChannelUrl": "http://www.youtube.com/channel/UCmKeE_YE3fXBqQHPY7GkP4g",
"authorChannelId": {
    "value": "UCmKeE_YE3fXBqQHPY7GkP4g"
},
"canRate": true,
"viewerRating": "none",
"likeCount": 0,
"publishedAt": "2023-08-03T09:40:16Z",
"updatedAt": "2023-08-03T09:40:16Z"
}
},
"canReply": true,
"totalReplyCount": 0,
"isPublic": true
} */


//for side bar
/*
 <div class="side-container">
                <div class="side-header">
                    <div class="all">All</div>
                    <div class="filter-owner">from tuco</div>
                </div>
                <div class="video-block">
                    <div class="video-side">
                        <a href=""><img src="thumbnail.jpg" alt=""></a>
                    </div>
                    <div class="side-video-details">
                        <span class="side-title">video-title here</span>
                        <span class="side-owner">channel-owner</span>
                        <div class="side-statistics">
                            <span class="view-count">500 views </span>
                            <div class="dot"><span class="material-symbols-outlined"
                                    style="color: #AAAAAA; font-size: 5px;"> circle</span></div>
                            <span class="date">time of upload</span>
                        </div>
                    </div>
                </div>

            </div>


            //inside

            <div class="video-block">
                    <div class="video-side">
                        <a href=""><img src="thumbnail.jpg" alt=""></a>
                    </div>
                    <div class="side-video-details">
                        <span class="side-title">video-title here</span>
                        <span class="side-owner">channel-owner</span>
                        <div class="side-statistics">
                            <span class="view-count">500 views </span>
                            <div class="dot"><span class="material-symbols-outlined"
                                    style="color: #AAAAAA; font-size: 5px;"> circle</span></div>
                            <span class="date">time of upload</span>
                        </div>
                    </div>
                </div>
*/

//search video object
/*
{
    "kind": "youtube#searchResult",
    "etag": "xGz8Mtx3YgynmTaHureFBqrWmb4",
    "id": {
        "kind": "youtube#video",
        "videoId": "50dJfbDyNuA"
    },
    "snippet": {
        "publishedAt": "2023-08-03T14:34:14Z",
        "channelId": "UCSQ7hHnWkDMyDBEp-h1Pqbg",
        "title": "Aaj Toh hoga Hi Rank Push !",
        "description": "Support the stream: https://streamlabs.com/binks69 #Live #valorantindia #valorant #Binks #s8ul Streamer for S8ul Esports ...",
        "thumbnails": {
            "default": {
                "url": "https://i.ytimg.com/vi/50dJfbDyNuA/default_live.jpg",
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": "https://i.ytimg.com/vi/50dJfbDyNuA/mqdefault_live.jpg",
                "width": 320,
                "height": 180
            },
            "high": {
                "url": "https://i.ytimg.com/vi/50dJfbDyNuA/hqdefault_live.jpg",
                "width": 480,
                "height": 360
            }
        },
        "channelTitle": "8bit Binks69",
        "liveBroadcastContent": "live",
        "publishTime": "2023-08-03T14:34:14Z"
    }
} */ 