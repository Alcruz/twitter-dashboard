const RT_PATTERN = /RT @\w+:\ */;

var twitterApi = {
    baseUrl: 'http://localhost:7890/1.1/',
    getLastestTweet(user, count = 30) {
        const url = `${this.baseUrl}/statuses/user_timeline.json?screen_name=${user}&count=${count}`;
        return fetch(url)
        .then(response => response.json())
    }
}

var app =  new Vue({
    data: {
        usersTweets: [],
    },
    mounted() {
        Promise.all(
            ['MakeSchool', 'newsycombinator', 'ycombinator']
            .map(user => twitterApi.getLastestTweet(user))
        )
        .then(results => this.usersTweets = results);
    }
});

app.getRetweetUser = text => {
    return text.match(RT_PATTERN)[0].replace('@', '').replace('RT', '').replace(':', '').trim();
}
app.getUserMentionName = tweet => {
    const username = app.getRetweetUser(tweet.text);
    return tweet.entities
        .user_mentions
        .filter(um => um.screen_name === username)[0].name;
}

app.getElapsedTime = (dateStr) => {
    const date = new Date(dateStr);
    let elapsedMiliseconds = (new Date() - date) / 1000;

    if (elapsedMiliseconds < 60)
        return 'Now';

    elapsedMiliseconds = elapsedMiliseconds / 60;
    if (elapsedMiliseconds < 60) 
        return `${Math.floor(elapsedMiliseconds)}m`;
    
    elapsedMiliseconds = elapsedMiliseconds / 60;
    if (elapsedMiliseconds < 24) 
        return `${Math.floor(elapsedMiliseconds)}h`;
    
    elapsedMiliseconds = elapsedMiliseconds / 24;
    if (elapsedMiliseconds < 7) 
        return `${Math.floor(elapsedMiliseconds)}d`;

    elapsedMiliseconds = elapsedMiliseconds / 7;
    if (elapsedMiliseconds < 4) 
        return `${Math.floor(elapsedMiliseconds)}w`;

    elapsedMiliseconds = elapsedMiliseconds / 4;
    if (elapsedMiliseconds < 12)  
        return date.toLocaleString("en-us", {
            month: "long"
          }).slice(9, 3);    

    elapsedMiliseconds = elapsedMiliseconds / 12;
    return `${Math.floor(elapsedMiliseconds)}y`;    
}

app.$mount('#app')