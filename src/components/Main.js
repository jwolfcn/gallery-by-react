require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imgData = require('../data/imageDatas.json');
//获取图片相关信息,转化图片URL路径信息
imgData = imgData.map(x=>{
  x.imgUrl = require('../images/'+x.fileName);
  return x;
});

/**
 * 生成一个随机数,范围[limt1,limt2]
 * @param limit1 下限
 * @param limit2 上限
 */
function getRandomByRange(limit1,limit2){
  return Math.ceil(Math.random()*(limit2-limit1))+limit1;
}

/**
 * 生成一个0-30度 中间的一个随机正负值
 */
function get30DegRandom(){
  return Math.ceil(Math.random()*60)-30;
}
class ImgFigure extends React.Component {

  handleClick =(e)=>{
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    // this.props.inverse();
    e.stopPropagation();
    e.preventDefault();
  };

  render() {

    //如果props属性中指定了这张图片的位置,则使用
    let {pos:styleObj={}} = this.props.arrange;

    //添加旋转角度
    this.props.arrange.rotate&&(
      ['-moz-','-ms-','-webkit-',''].forEach(function(v){
        styleObj[v+'transform'] = 'rotate('+this.props.arrange.rotate +'deg)';
      }.bind(this))
    );

    //让中间的图片的层次置顶
    this.props.arrange.isCenter&&(
      styleObj.zIndex = 11
    );

    //判断是否翻转
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }

  /**
   * 点击相应函数
   */
}
class GalleryByReactApp extends React.Component {
  //构建方法,定义实例属性
  constructor() {
    super();
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr : []
    };
  }

  //组件加载后,为每张图片计算其位置的范围
  componentDidMount(){
    console.log('inner didMount');
    //首先拿到舞台的大小
    var stageDom = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDom.scrollWidth,
      stageH = stageDom.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    var imgFigureDOM =ReactDOM.findDOMNode(this.refs.figure_0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);
    //计算中心图片的位置
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };
    //计算左侧,右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearange(0);
  }

  render() {
    let controllerUnits = [],imgFigures = [];
    imgData.forEach(function(value,index){
      !(this.state.imgsArrangeArr[index])&&(
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      );
      let inverseFn = ()=>{
        console.log('index--->'+index);
        var imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
      };
      let centerFn = ()=>{
        this.rearange(index);
      };
      imgFigures.push(<ImgFigure data={value} key={'figure_'+index} ref={'figure_'+index}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={inverseFn} center={centerFn}/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          <controllerUnits/>
        </nav>
      </section>
    );
  }
  /*
   * 重新布局所有图片
   * @param index 指定居中排布哪个图片
   */
  rearange(index){
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRihgtSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),//1\0
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(index,1);

    //首先居中centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;
    //居中的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;
    //居中的图片标识isCenter 为true
    imgsArrangeCenterArr[0].isCenter = true;

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    console.log('rearange--->'+topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr = imgsArrangeTopArr.map((v,i)=>{
      return {
        pos:{
          top:getRandomByRange(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRandomByRange(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }
    });
    console.log('imgsArrangeTopArr---');
    console.log(imgsArrangeTopArr);

    //布局两侧的图片
    for(let i = 0, j = imgsArrangeArr.length, k = j / 2; i<j; i++){
      let hPosRangeLORX = i<k?hPosRangeLeftSecX:hPosRangeRihgtSecX;
      imgsArrangeArr[i]={
        pos: {
          top:getRandomByRange(hPosRangeY[0],hPosRangeY[1]),
          left:getRandomByRange(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }
    }
    if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(index,0,imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr:imgsArrangeArr
    })
  }

}
//静态属性
GalleryByReactApp.defaultProps = {

};

export default GalleryByReactApp;
