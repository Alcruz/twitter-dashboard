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

app.$mount('#app')