import React, {Component} from "react";
import Header from "../components/Header";
import HomepageContent from "../components/HomepageContent";
import NavigationBar from "../components/NavigationBar";
import SubHeader from "../components/SubHeader";
import '../styles/Header.css';
import '../styles/NavigationBar.css';
import '../styles/SubHeader.css';

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <NavigationBar />
        <SubHeader page='Home' all_tabs={['Developer','Designer']}/>
        <HomepageContent contentHeading='Recruitment Seasons'/>
      </>
    )
  }
}

export default Home