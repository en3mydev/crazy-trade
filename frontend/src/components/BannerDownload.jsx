import "./BannerDownload.css";
import Phone from "../images/bannerphone/phone.png";
import appStore from "../images/bannerphone/appstore.svg";
import googlePlay from "../images/bannerphone/googleapp.svg";

const BannerDownload = () => {
  return (
    <div className="banner-download">
      <div className="banner-download__left">
        <h1>Trade anytime, anywhere</h1>
        <h2>Download the app and start trading in minutes</h2>
        <div className="banner-download__btns">
          <img alt="download_img" src={googlePlay} />
          <img alt="download_img" src={appStore} />
        </div>
      </div>
      <div className="banner-download__right">
        <img src={Phone} alt="phone" />
      </div>
    </div>
  );
};

export default BannerDownload;
