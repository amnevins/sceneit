import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Button, List, ListItem, SearchBar, Card, SwipeDeck } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { Login } from './login';
import { Signup } from './signup';


import themoviedb from 'themoviedb-javascript-library';
themoviedb.common.api_key = "0d4e5741aa0f8d374c2c43a8006878e8";

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    constructor(props) {
        super(props);
        console.log('prooopppss home', this.props);
        this.state = {
            username: '',
            password: '',
            userToken: ''
        };
    }

    updateUserToken(userToken){
        console.log('called that shit');
        this.setState({
            userToken: userToken
        });
    }

    render() {
        return (
            <View>
                {!this.props.userToken ?
                    <View>
                        <Button
                            raised
                            icon={{name: 'home', size: 32}}
                            buttonStyle={{backgroundColor: 'red', borderRadius: 10, margin: 10}}
                            onPress={() => this.props.navigation.navigate('Login', {
                                updateUserToken: this.updateUserToken.bind(this)
                            })}
                            textStyle={{textAlign: 'center'}}
                            title={`Login`}
                        />
                        < Button
                            raised
                            icon={{name: 'home', size: 32}}
                            buttonStyle={{backgroundColor: 'red', borderRadius: 10, margin: 10}}
                            onPress={() => this.props.navigation.navigate('Signup', {
                                updateUserToken: this.updateUserToken
                            })}
                            textStyle={{textAlign: 'center'}}
                            title={`Signup`}
                        />
                    </View>
                    :
                    <View>
                        <Button
                            raised
                            icon={{name: 'home', size: 32}}
                            buttonStyle={{backgroundColor: 'red', borderRadius: 10, margin: 10}}
                            onPress={() => this.props.navigation.navigate('Movies')}
                            textStyle={{textAlign: 'center'}}
                            title={`Proceed`}
                        />
                        < Button
                            raised
                            icon={{name: 'home', size: 32}}
                            buttonStyle={{backgroundColor: 'red', borderRadius: 10, margin: 10}}
                            onPress={() => this.props.navigation.navigate('Recommendations')}
                            textStyle={{textAlign: 'center'}}
                            title={`Recommendations`}
                        />
                        <Button
                            raised
                            icon={{name: 'home', size: 32}}
                            buttonStyle={{backgroundColor: 'red', borderRadius: 10, margin: 10}}
                            onPress={() => this.props.navigation.navigate('WatchList')}
                            textStyle={{textAlign: 'center'}}
                            title={`Watch List`}
                        />
                    </View>
                }
            </View>
        );
    }
}

const SCREEN_HEIGHT = 600;
const SCREEN_WIDTH = 400;
class Recommendations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [{
                title: 'Fight Club',
                release_date: '1/1/1999',
                image: {
                    uri: 'http://f9view.com/wp-content/uploads/2013/10/American-Beautiful-Girls-Wallpapers-Hollywood-Celebs-1920x1200px.jpg'
                }
            }]
        }
    }
    static navigationOptions = {
        title: 'Recommendations',
    };
    getRecommendations = () => {
        var self = this;

        themoviedb.movies.getPopular({},
            function (movies) {
                movies = JSON.parse(movies);
                if (movies.results && movies.results.length > 0) {
                    self.setState({
                        movies: movies.results
                    })
                }
            },
            function (error) {
                // do something with errorCallback
                console.error(error)
            })
    }

    componentDidMount = () => {
        console.log(this.state.movies);
        this.getRecommendations()
    }

    renderCard(card) {
        return (
            <Card
                key={card.title}
                containerStyle={{borderRadius: 10, width: SCREEN_WIDTH * 0.92, height: SCREEN_HEIGHT - 165}}
                featuredTitle={`${card.title}, ${card.release_date}`}
                featuredTitleStyle={{position: 'absolute', left: 15, bottom: 10, fontSize: 30 }}
                image={{ uri: `https://image.tmdb.org/t/p/w500/${card.poster_path}` }}
                imageStyle={{borderRadius: 10, width: SCREEN_WIDTH * 0.915, height: SCREEN_HEIGHT - 165}}
            />
        )
    }

    onSwipeRight(card) {
        console.log("Card liked: " + card.title);
    }

    onSwipeLeft(card) {
        console.log("Card disliked: " + card.title);
    }

    renderNoMoreCards() {
        return (
            <Card
                containerStyle={{borderRadius: 10, width: SCREEN_WIDTH * 0.92, height: SCREEN_HEIGHT - 165}}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={{ uri: 'https://i.imgflip.com/1j2oed.jpg' }}
                imageStyle={{borderRadius: 10, width: SCREEN_WIDTH * 0.915, height: SCREEN_HEIGHT - 165}}
            />
        )
    }

    render() {
        return (
            <View>
                <SwipeDeck
                    data={this.state.movies}
                    renderCard={this.renderCard}
                    renderNoMoreCards={this.renderNoMoreCards}
                    onSwipeRight={this.onSwipeRight}
                    onSwipeLeft={this.onSwipeLeft}
                />
            </View>
        );
    }
}

class WatchList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
        }
    }
    static navigationOptions = {
        title: 'Watch List',
    };
    getFavorites = () => {
        var self = this

        themoviedb.movies.getPopular({},
            function (movies) {
                movies = JSON.parse(movies)
                if (movies.results && movies.results.length > 0) {
                    self.setState({
                        movies: movies.results
                    })
                }
            },
            function (error) {
                // do something with errorCallback
                console.error(error)

            })
    }

    componentDidMount = () => {
        console.log(this.state.movies);
        this.getFavorites()
    }

    render() {
        return (
            <View>
                <SearchBar
                    round
                    lightTheme
                    onChangeText={this.handleSearch}
                    placeholder='Type Here...'
                />
                <List containerStyle={{marginBottom: 20}}>
                    {
                        this.state.movies.map((l, i) => (
                            <ListItem
                                roundAvatar
                                avatar={`https://image.tmdb.org/t/p/w500/${l.poster_path}`}
                                key={i}
                                onPress={() => this.props.navigation.navigate('Movie', {name: `${l.title}`})}
                                title={l.title}
                            />
                        ))
                    }
                </List>
            </View>
        );
    }
}

class MoviesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
        }
    }
    static navigationOptions = {
        title: 'Movies',
    };
    getMovies = () => {
        var self = this

        themoviedb.movies.getPopular({},
            function (movies) {
                movies = JSON.parse(movies)
                if (movies.results && movies.results.length > 0) {
                    self.setState({
                        movies: movies.results
                    })
                }
            },
            function (error) {
                // do something with errorCallback
                console.error(error)

            })
    }
    handleSearch = (term) => {
        if (!term) {
            return this.getMovies();
        }
        var self = this;

        themoviedb.search.getMovie({query: term},
        function (movies) {
            movies = JSON.parse(movies)
            console.log(movies.results);
            if (movies.results && movies.results.length > 0) {
                self.setState({
                    movies: movies.results
                })
            }
        },
        function (error) {
            // do something with errorCallback
            console.error(error)

        })
    }

    componentDidMount = () => {
        console.log(this.state.movies);
        this.getMovies()
    }

    render() {
        return (
            <View>
                <SearchBar
                    round
                    lightTheme
                    onChangeText={this.handleSearch}
                    placeholder='Type Here...'
                />
                <List containerStyle={{marginBottom: 20}}>
                    {this.state.movies ?
                        this.state.movies.map((l, i) => (
                            <ListItem
                                roundAvatar
                                avatar={`https://image.tmdb.org/t/p/w500/${l.poster_path}`}
                                key={i}
                                onPress={() => this.props.navigation.navigate('Movie', {name: `${l.title}`})}
                                title={l.title}
                            />
                        ))
                        :
                        null
                    }
                </List>
            </View>
        );
    }
}

class MovieScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: {
                title: 'A title',
                overview: 'a description',
                poster_path: 'y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg'
            },
        }
    }

    static navigationOptions = {
        title: 'Movie'
    };
    getMovie = () => {
        var self = this

        themoviedb.search.getMovie({query: this.props.navigation.state.params.name},
            function (movie) {
                movie = JSON.parse(movie)
                console.log(movie.results);
                if (movie.results && movie.results.length > 0) {
                    self.setState({
                        movie: movie.results[0]
                    })
                }
            },
            function (error) {
                // do something with errorCallback
                console.error(error)

            })
    }

    componentDidMount = () => {
        console.log(this.state.movies);
        this.getMovie()
    }

    render() {
        return (
            <View>
                {
                    this.state.movie ?
                    <Card
                        title={this.state.movie.title}
                        image={{uri:`https://image.tmdb.org/t/p/w500${this.state.movie.poster_path}`}}>
                        <Text style={{marginBottom: 10}}>
                            {this.state.movie.overview}
                        </Text>
                        <Button
                            icon={{name: 'code'}}
                            backgroundColor='#03A9F4'
                            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                            title='Save Movie'/>
                        <Button
                            icon={{name: 'code'}}
                            backgroundColor='#03A9F4'
                            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                            title='Recommend Movie'/>
                    </Card>
                    : <Text style={{marginBottom: 10}}>
                        No move found
                    </Text>
                }
            </View>
        )
    }
}

const SimpleApp = StackNavigator({
    Home: {
        screen: HomeScreen
    },
    Login: {
        screen: Login
    },
    Signup: {
        screen: Signup
    },
    Movies: {
        screen: MoviesScreen
    },
    Movie: {
        screen: MovieScreen,
        path: 'people/:name'
    },
    WatchList: {
        screen: WatchList
    },
    Recommendations: {
        screen: Recommendations
    }
});

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userToken: null
        }
    }
    render() {
        return (
            <SimpleApp screenProps={{userToken: this.state.userToken, carfield: 'kdsakdsakdskj'}} />
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
