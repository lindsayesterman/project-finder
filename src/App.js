import React, { Component } from "react";
import earth from "./earth-crop.png";
import "./App.css";
import { Route, Link } from "react-router-dom";
import Header from "./Header/Header.js";
import Discover from "./Discover/Discover";
import Post from "./PostPage/PostPage";
import ProjectPage from "./ProjectPage/ProjectPage";
import ProjectsContext from "./ProjectsContext";
import config from "./config"

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      error: null,
    };
  }

  componentDidMount() {
    return Promise.all([fetch(`${config.API_ENDPOINT}/projects`)])
      .then(([projectsRes]) => {
        if (!projectsRes.ok)
          return projectsRes.json().then((e) => Promise.reject(e));
        return Promise.all([projectsRes.json()]);
      })
      .then(([projects]) => {
        this.setState({
          projects,
        });
      })
      .catch((error) => {
        this.setState({ error });
        console.error({ error });
      });
  }

  addProject = (project) => {
    this.setState({
      projects: [this.state.projects, project],
    });
  };

  render() {
    const context = {
      projects: this.state.projects,
      addProject: (project) => {
        this.addProject(project);
      },
      setAppData: this.setAppData,
    };
    return (
      <ProjectsContext.Provider value={context}>
        <div className="app">
          <Route exact path="/">
            <Header />
            <h1 className="front-page-descrip">
              Find projects to help build your portfolio. Sort by topic,
              difficulty level, or likes.
            </h1>
            <div className="button-holder">
              <Link to="/discover" style={{ textDecoration: "none" }}>
                <button className="start-browsing">Find ideas</button>
              </Link>
              <Link to="/post" style={{ textDecoration: "none" }}>
                <button className="start-posting">Post Ideas </button>
              </Link>
            </div>
            <img className="earth" alt="earth" src={earth}></img>
          </Route>
          <Route
            path="/discover"
            render={(routeProps) => {
              return <Discover projects={context.projects} {...routeProps} />;
            }}
          />
          <Route
            path="/post"
            render={(routeProps) => {
              return <Post projects={context.projects} {...routeProps} />;
            }}
          />
          <Route
            path="/projects/:projectId"
            render={(routeProps) => {
              return (
                <ProjectPage projects={context.projects} {...routeProps} />
              );
            }}
          />
        </div>
      </ProjectsContext.Provider>
    );
  }
}
