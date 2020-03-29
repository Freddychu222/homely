import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link
} from "react-router-dom";
import styled from "styled-components";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { Todo } from "./components/Todo";
import SplitButton from "./components/SplitButton";
import Feed from "./components/Feed";
// import { Register } from "./components/Accounts/Register";
// import { Login } from "./components/Accounts/Login";
import { LoginButton } from "./components/LoginButton";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { MyList } from "./components/MyList";
import Logo from "./images/logo.png";

const Container = styled("div")`
  margin: auto;
  justify-content: center;
  text-align: center;
`;

const Header = styled("div")`
  padding: 20px;
  text-align: left;
  background: #3b55de;
  color: #f5e5e5;
  font-family: "Quando", serif;
`;

const FeedColor = styled("div")`
  background: #EDCADB;
  padding: 40px;
  margin: 0px 40px 0px 70px;
`;

const Sticky = styled("div")`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
`;

const exampleTodos = [
  {"id": 5, "title": "Hit the gym", "description": "a", "completed": false, "owner": 1},
  {"id": 6, "title": "Pay bills", "description": "a", "completed": true, "owner": 1},
  {"id": 7, "title": "Meet George", "description": "a", "completed": false, "owner": 1},
  {"id": 8, "title": "Buy eggs", "description": "a", "completed": false, "owner": 1},
  {"id": 9, "title": "Read a book", "description": "a", "completed": false, "owner": 1},
  {"id": 10, "title": "Organize office", "description": "a", "completed": false, "owner": 1}
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUserToken: null,
      activeUser: null,
      activeUserTodos: exampleTodos,
      loggingIn: false,
      todoList: []
      // [
      //   <li>Hit the gym</li>,
      //   <li className="checked">Pay bills</li>,
      //   <li>Meet George</li>,
      //   <li>Buy eggs</li>,
      //   <li>Read a book</li>,
      //   <li>Organize office</li>,
      // ]
    };
    this.setToken = this.setToken.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.generateTodoList = this.generateTodoList.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    console.log("GENERATING TODO");
    this.generateTodoList();
  }

  fetchUserInfo() {
    console.log(
      "Attemping to fetch user info using: ",
      `Token ${this.state.activeUserToken}`
    );
    axios
      .get("http://localhost:8000/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.activeUserToken}`
        }
      })
      .then(res => {
        this.setState({
          activeUser: res.data,
          activeUserTodos: res.data.todo_set
        });
        this.generateTodoList();
      })
      .catch(err => console.log(err));
  }
  setToken(userToken) {
    this.setState({ activeUserToken: userToken, loggingIn: false });
    this.fetchUserInfo();
  }
  handleLogout() {
    if (!this.state.activeUserToken) return;
    console.log(
      "Attemping to log out user using: ",
      `Token ${this.state.activeUserToken}`
    );
    axios
      .post("http://localhost:8000/api/auth/logout", null, {
        headers: {
          Authorization: `Token ${this.state.activeUserToken}`
        }
      })
      .then(res => {
        console.log(res);
        this.setState({
          activeUserToken: null,
          activeUser: null,
          activeUserTodos: [],
        });
      })
      .catch(err => console.log(err));
  }

  generateTodoList() {
    if (!this.state.activeUserTodos) return;
    var todoList = []
    for(let i = 0; i < this.state.activeUserTodos.length; i++) {
      let todo = this.state.activeUserTodos[i];
      let className = todo.completed ? "checked" : "";
      let title = todo.title;
      todoList.push(
        <li key={i} onClick={() => {this.toggleComplete(i)}} className={className}>{title}</li>
      );
    }
    this.setState({
      todoList: todoList
    });
  }

  toggleComplete(i) {
    if (this.state.activeUserTodos.length <= i) return;
    let myTodos = this.state.activeUserTodos;
    myTodos[i].completed = !myTodos[i].completed;

    // not logged in
    if(!this.state.activeUser) {
      this.setState({
        activeUserTodos: myTodos
      })
      this.generateTodoList();
      return;
    }
    console.log("attempting request on", myTodos[i].id, "with", myTodos[i]);
    axios
      .put(`http://localhost:8000/api/todos/${myTodos[i].id}/`, myTodos[i], {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        console.log("successfully wrote");
        this.setState({
          activeUserTodos: myTodos
        })
        this.generateTodoList();
      })
      .catch(err => console.log(err));
  }

  addTodo(newData) {
    let newTodo = {
      title: newData,
      completed: false,
      owner: this.state.activeUser ? this.state.activeUser.id : -1
    };

    // If user isn't logged in
    if (!this.state.activeUser) {
      let myTodos = this.state.activeUserTodos;
      myTodos.push(newTodo);
      this.setState({ activeUserTodos: myTodos });
      this.generateTodoList();
      console.log("User isnt logged in");
      return;
    }

    console.log("You're logged in");
    axios
      .post("http://localhost:8000/api/todos/", newTodo)
      .then(res => {
        let myTodos = this.state.activeUserTodos;
        myTodos.push(newTodo);
        this.setState({ activeUserTodos: myTodos });
        // console.log(myTodos);
        return true;
      })
      .catch(err => console.log(err));
    return false;
  }

  renderTodos() {
    if (!this.state.activeUserTodos) return;
    let todoList = [];
    for (let todo of this.state.activeUserTodos) {
      todoList.push(<li key={todo.id}>{todo.title}</li>);
    }
    return todoList;
  }

  render() {
    console.log("TODO LIST");
    console.log(this.state.todoList);
    let activeUserName = this.state.activeUser
      ? this.state.activeUser.username
      : "";
    let logButton = this.state.activeUser ? (
      <Link to="/">
        <button className="log-button" onClick={this.handleLogout}>
          Logout
        </button>
      </Link>
    ) : (
      <Link to="/login">
        <button className="log-button" onClick={()=>this.setState({loggingIn: true})}>Login</button>
      </Link>
    );
    let userGreeting = this.state.activeUser
      ? "welcome " + activeUserName + "!"
      : "";
    let myList = this.state.loggingIn ? null : <MyList todos={this.state.todoList} onSubmit={this.addTodo}></MyList>;
    return (
        <Container>
          <Router>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Header>
                  <div className="logo-text">
                      <Link to="/"
                      style={{ textDecoration: "none", color: "#F0E9E4" }}
                      onClick={() => this.setState({loggingIn: false})}>
                        homely
                        <img src={Logo} className="logo" />
                      </Link>
                      {logButton}
                      <div className="user-greeting">{userGreeting}</div>
                  </div>
                </Header>
              </Grid>
              <Grid item xs={8}>
                <FeedColor>
                  <SplitButton></SplitButton>
                  <Feed></Feed>
                </FeedColor>
              </Grid>
              <Grid item xs={4}>
                {myList}
                <Switch>
                  <Route
                    expact
                    path="/register"
                    render={props => (
                      <Register
                        {...props}
                        setToken={this.setToken}
                        activeUser={this.state.activeUser}
                      />
                    )}
                  />
                  <Route
                    expact
                    path="/login"
                    render={props => (
                      <Login
                        {...props}
                        setToken={this.setToken}
                        activeUser={this.state.activeUser}
                      />
                    )}
                  />
                </Switch>
              </Grid>
            </Grid>
            <Grid item xs={4}>
          </Grid>
        </Router>
      </Container>
    );
  }
}

export default App;
