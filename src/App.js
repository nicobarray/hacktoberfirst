import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import Title from "./svgs/title.svg";
import github from "./github";

const AppView = styled.div`
  height: 100vh;

  background-color: #293788;
  color: white;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const AppHeader = styled.div`
  height: 400px;
  padding: 32px;

  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  font-family: "Pangolin", serif;
  font-size: 32px;
`;

const AppBody = styled.div`
  height: calc(100vh - 400px);
  width: 100%;

  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`;

const IssueListHeader = styled.div`
  height: 128px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
`;

const IssueView = styled.div`
  height: 50px;
  min-height: 50px;
  width: 100%;
  min-width: 400px;

  display: flex;

  padding-right: 16px;
  margin-top: 16px;

  background-color: ${props =>
    props.issue.state === "closed" ? "#ff625f" : "#ff9467"};

  font-size: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  text-overflow: ellipsis;

  box-shadow: 4px 4px rgba(156, 156, 156, 0.7);
`;

const IssueList = styled.div`
  width: 100%;
  padding: 16px;

  display: flex;
  flex-flow: column nowrap;
  overflow-y: auto;
`;

const IssuerAvatar = styled.img`
  height: 128px;
  width: 128px;
  border-radius: 50%;
`;

const IssuerView = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const IssueRepoName = styled.div`
  width: 20%;
  padding: 4px;

  display: flex;
  flex-flow: column nowrap;
  align-items: left;

  background-color: #313131;
`;

const Text = styled.span`
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const IssueNumber = Text.extend`
  width: 20%;
  line-height: 50px;
  text-align: center;
  background-color: #414141;
`;

const IssueMessage = styled.div`
  flex: 1;
  padding-left: 8px;
  padding-right: 4px;
`;

const IssuerStats = Text.extend`
  font-size: 32px;
  text-align: center;
  font-family: "Pangolin", serif;
`;

const Button = styled.button`
  text-decoration: none;
  border-bottom: 1px solid white;
  font-size: 32px;
  font-family: "Pangolin", serif;
  color: #ff9467;
  background-color: transparent;
  border: none;
`;

const BottomText = Text.extend`
  font-size: 12px;
  font-style: italic;
`;

const P = styled.p`text-align: center;`;

const transformItemToIssue = item => {
  // eslint-disable-next-line
  const [repoName, projectName, ...rest] = item.url
    .replace("https://api.github.com/repos/", "")
    .split("/");
  return {
    id: item.id,
    repoName,
    projectName,
    title: item.title,
    number: "#" + item.number,
    state: item.state
  };
};

class App extends Component {
  state = {
    player1Username: "you",
    player2Username: "him",
    player1: [],
    player2: [],
    player1Avatar: null,
    player2Avatar: null
  };

  updateUserData = (listKey, avatarKey) => issues => {
    console.log("issues: ", issues);
    if (!issues || !issues.items || issues.items.length === 0) return;

    this.setState(prevState => ({
      [listKey]: [...issues.items].map(transformItemToIssue) || [],
      [avatarKey]:
        issues.items.length > 0 ? issues.items[0].user.avatar_url : null
    }));
  };

  componentDidMount() {
    const { player1, player2 } = this.props.match.params;
    console.log(this.props.match.params);

    const player1Username = player1 || this.state.player1Username;
    const player2Username = player2 || this.state.player2Username;

    github(player1Username).then(
      this.updateUserData("player1", "player1Avatar")
    );
    github(player2Username).then(
      this.updateUserData("player2", "player2Avatar")
    );

    this.setState(prevState => ({ player1Username, player2Username }));
  }

  renderIssueList(who) {
    return who.map((issue, index) => {
      console.log(issue);
      return (
        <IssueView key={issue.id} issue={issue}>
          <IssueRepoName>
            <Text>{issue.repoName}</Text>
            <Text>{issue.projectName}</Text>
          </IssueRepoName>
          <IssueNumber>{issue.number}</IssueNumber>
          <IssueMessage>{issue.title}</IssueMessage>
        </IssueView>
      );
    });
  }

  countClosedPR = prs =>
    prs.reduce((count, pr) => count + (pr.state === "closed" ? 1 : 0), 0);

  countOpenPR = prs => prs.length - this.countClosedPR(prs);

  updateUsername = key => event => {
    event.preventDefault();
    console.log(key, event.target.value);
    const value = event.target.value;
    this.setState(prevState => ({ [key]: value }));
  };

  changeUsers = () => {
    const player1Username = this.state.player1Username;
    const player2Username = this.state.player2Username;

    github(player1Username).then(
      this.updateUserData("player1", "player1Avatar")
    );
    github(player2Username).then(
      this.updateUserData("player2", "player2Avatar")
    );
  };

  render() {
    return (
      <AppView>
        <AppHeader>
          <img src={Title} alt="title" />
          <P>
            If you want to challenge a friend and keep track of your mutual
            progress then insert you github username{" "}
            <input
              onChange={this.updateUsername("player1Username")}
              value={this.state.player1Username}
              placeholder="username"
            />{" "}
            and his github username{" "}
            <input
              onChange={this.updateUsername("player2Username")}
              value={this.state.player2Username}
              placeholder="username"
            />{" "}
            and click that <Button onClick={this.changeUsers}>button!</Button>
          </P>
        </AppHeader>

        <AppBody>
          {this.state.player1Avatar == null ? null : (
            <IssuerView>
              <IssueListHeader>
                <IssuerAvatar
                  src={this.state.player1Avatar}
                  alt={this.props.match.params.player1}
                />
                <IssuerStats>
                  open+closed= {this.countOpenPR(this.state.player1)}+{this.countClosedPR(this.state.player1)}={" "}
                  {this.state.player1.length}
                </IssuerStats>
              </IssueListHeader>
              <IssueList>{this.renderIssueList(this.state.player1)}</IssueList>
            </IssuerView>
          )}
          {this.state.player2Avatar == null ? null : (
            <IssuerView>
              <IssueListHeader>
                <IssuerAvatar
                  src={this.state.player2Avatar}
                  alt={this.props.match.params.player2}
                />
                <IssuerStats>
                  open+closed= {this.countOpenPR(this.state.player2)}+{this.countClosedPR(this.state.player2)}={" "}
                  {this.state.player2.length}
                </IssuerStats>
              </IssueListHeader>
              <IssueList>{this.renderIssueList(this.state.player2)}</IssueList>
            </IssuerView>
          )}
        </AppBody>
        <BottomText>
          Disclaimer: This site is fan made and not affiliated with
          Hacktoberfest. Made by @nek0las, inspired by Hacktoberfest checker.
        </BottomText>
      </AppView>
    );
  }
}

export default withRouter(App);
