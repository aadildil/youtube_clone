

const dataApi_key = "AIzaSyAQNFuK_xjHRCozEHo0_5sktC7UE-HGIaI";
const container = document.getElementsByClassName("container")[0];
const searchField = document.getElementById("search");
const searchButton = document.getElementsByClassName("search-icon")[0];

const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${dataApi_key}`;
const channelApi=`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=`;

async function getChannelDetails(channelId)
{
   
    const channelUrl=`${channelApi}${channelId}&key=${dataApi_key}`;
    const response=await fetch(channelUrl,{method:"GET"});
    const result=await response.json();
    return result.items[0];
}


async function getResults(url) {

    
   
    const response = await fetch(url, { method: "GET" });
    const results = await response.json();
    const videoList=results.items;
    console.log(videoList);
    container.innerHTML="";
     addItem(videoList);
     container.scrollTop=0;
}

function addItem(videoList) {
    videoList.forEach( async video => {
        

        const {snippet}=video;//const snippet=video.snippet

        const channelDetails=await getChannelDetails(snippet.channelId);
         const channelSnippet=channelDetails.snippet;
         const channelLogo=channelSnippet.thumbnails.medium.url
         console.log(channelSnippet);




        const card = document.createElement("div");
        card.className = "card";
        card.id=`${video.id.videoId}`;

        card.innerHTML = ` <div class="video-container">
        <a href="videoPage.html?videoId=${video.id.videoId}"><img src=${snippet.thumbnails.high.url} alt=""></a>
        <div class="duration">
            <span>1:09</span>
        </div>

    </div>
    
    <div class="details">
        <div class="channel-logo">
            <img src="${channelLogo}" alt="">
        </div>
        <div class="video-details">
            <div class="video-title">
                <span>${snippet.title}</span>
            </div>
            <div class="channel-name">
                <span>${snippet.channelTitle}</span>
                <div class="view-details">
                    <span class="view-count">1.3M views </span>
                    <div class="dot"><span class="material-symbols-outlined" style="color: #AAAAAA; font-size: 5px;">circle</span></div>
                    <span class="date">${convertTime(snippet.publishedAt)}</span>
                </div>
            </div>

        </div>
    </div>`;

    container.appendChild(card);
    });
    
}

searchButton.addEventListener("click", () => {
    const searchString = searchField.value;
    if (searchString === "")
        return;
        let url = `${apiUrl}&q=${searchString}&part=snippet&maxResults=33`;
    getResults(url);
});


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

getResults(`${apiUrl}&part=snippet&maxResults=33`)

/*{
    "kind": "youtube#searchResult",
    "etag": "XRDL54L_g3MxhhCZVP0qxnXAPX0",
    "id": {
        "kind": "youtube#channel",
        "channelId": "UCboQK2pH3xWakPOJv91RbOA"
    },
    "snippet": {
        "publishedAt": "2016-03-17T21:12:34Z",
        "channelId": "UCboQK2pH3xWakPOJv91RbOA",
        "title": "BARIŞ BRA",
        "description": "BARIŞ BRAAAAaaaaa Merhaba Oyun severler bugün buraya bakıyorsanız beni merak ettiniz demektir 1993 doğumlu işini ...",
        "thumbnails": {
            "default": {
                "url": "https://yt3.ggpht.com/ytc/AOPolaRvgWKloZZ15frzh1GiGAR9opYJy7pfbDtrkWPhCg=s88-c-k-c0xffffffff-no-rj-mo"
            },
            "medium": {
                "url": "https://yt3.ggpht.com/ytc/AOPolaRvgWKloZZ15frzh1GiGAR9opYJy7pfbDtrkWPhCg=s240-c-k-c0xffffffff-no-rj-mo"
            },
            "high": {
                "url": "https://yt3.ggpht.com/ytc/AOPolaRvgWKloZZ15frzh1GiGAR9opYJy7pfbDtrkWPhCg=s800-c-k-c0xffffffff-no-rj-mo"
            }
        },
        "channelTitle": "BARIŞ BRA",
        "liveBroadcastContent": "none",
        "publishTime": "2016-03-17T21:12:34Z"
    }
}*/ 

/* <div class="main">
        <div class="side-bar">
            <div class="side-bar-group">
                <div class="item selected-item">
                    <span class="icon material-symbols-outlined ">home</span>
                    <span class="icon-title">Home</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined ">explore</span>
                    <span class="icon-title">Explore</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">subscriptions</span>
                    <span class="icon-title">Subscriptions</span>
                </div>
            </div>
            <div class="side-bar-group">
                <div class="item">
                    <span class="icon material-symbols-outlined">video_library</span>
                    <span class="icon-title">Library</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined ">history</span>
                    <span class="icon-title">History</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">smart_display</span>
                    <span class="icon-title">Your Videos</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">watch_later</span>
                    <span class="icon-title">Watch Later</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">thumb_up</span>
                    <span class="icon-title">Liked Videos</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">arrow_drop_down</span>
                    <span class="icon-title">Show More</span>
                </div>
            </div>
            <div class="side-bar-group">
                <p class="side-bar-headings">Subscriptions</p>
                <div class="item ">
                    <span class="icon material-symbols-outlined ">home</span>
                    <span class="icon-title">Home</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined ">explore</span>
                    <span class="icon-title">Explore</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">subscriptions</span>
                    <span class="icon-title">Subscriptions</span>
                </div>
            </div>
            <div class="side-bar-group">
                <p class="side-bar-headings">More From Youtube</p>
                <div class="item ">
                    <span class="icon material-symbols-outlined ">home</span>
                    <span class="icon-title">Home</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined ">explore</span>
                    <span class="icon-title">Explore</span>
                </div>
                <div class="item">
                    <span class="icon material-symbols-outlined">subscriptions</span>
                    <span class="icon-title">Subscriptions</span>
                </div>
            </div>



        </div>
        <div class="container">
            <div class="card">
                <div class="video-container">
                    <img src="thumbnail.jpg" alt="">
                    <div class="duration">
                        <span>1:09</span>
                    </div>

                </div>
                
                <div class="details">
                    <div class="channel-logo">
                        <img src="channel-logo" alt="">
                    </div>
                    <div class="video-details">
                        <div class="video-title">
                            <span> afosadasdasdasdasdads to kisdlksdjinjsd sadasdasdasdasdads asdasdasdasdasdasdasdad
                                kisdlksdjinjsd</span>
                        </div>
                        <div class="channel-name">
                            <span>channel name</span>
                            <div class="view-details">
                                <span class="view-count">1.3M views </span>
                                <div class="dot"><span class="material-symbols-outlined" style="color: #AAAAAA; font-size: 5px;">circle</span></div>
                                <span class="date"> 1 week ago</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

         
        </div>
    </div>*/