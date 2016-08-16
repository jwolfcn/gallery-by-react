require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


let imgData = require('../data/imageDatas.json');
//获取图片相关信息,转化图片URL路径信息
imgData = imgData.map(x=>{
  x.imgUrl = require('../images/'+x.fileName);
  return x;
});
let img = require('../images/1.jpg');
console.log(img);
console.log(imgData);
class GalleryByReactApp extends React.Component {

  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
