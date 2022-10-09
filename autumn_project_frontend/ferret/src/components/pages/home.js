import React, {Component} from "react";
import Header from "../header/index";
import HomepageContent from "../home_page_content/index";
import NavigationBar from "../navbar/index";
import SubHeader from "../subheader/index";

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