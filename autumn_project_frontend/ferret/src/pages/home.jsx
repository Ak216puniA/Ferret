import React, {Component} from "react";
import Header from "../components/header/index";
import HomepageContent from "../components/home_page_content/index";
import NavigationBar from "../components/navbar/index";
import SubHeader from "../components/subheader/index";

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <NavigationBar />
        <SubHeader page='Home' initialTabs={['Developer','Designer']}/>
        <HomepageContent contentHeading='Recruitment Seasons'/>
      </>
    )
  }
}

export default Home