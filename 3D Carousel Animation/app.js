import React, {useState} from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
const CARDS = 10;
const MAX_VISIBILITY = 3;
const images = [
"https://github.com/HackUniv/Images/assets/119047006/9941ccf1-157c-4a67-ae6a-d75e84c70a85",
"https://github.com/HackUniv/Images/assets/119047006/91567f4d-9c57-46d4-a527-eea24f21976b",
"https://github.com/HackUniv/Images/assets/119047006/b256e3dd-2c25-4292-a9c5-4e5d610877dc",
"https://github.com/HackUniv/Images/assets/119047006/94f6216c-e565-4740-88ce-df2c7531a003",
"https://github.com/HackUniv/Images/assets/119047006/9b9a1293-8756-4e6e-a809-20de0a2f3e9a",
"https://github.com/HackUniv/Images/assets/119047006/9a888ee2-8275-408c-8749-c68371512871",
"https://github.com/HackUniv/Images/assets/119047006/10342278-5a87-4659-a56a-ab60abfcd3c8",
"https://github.com/HackUniv/Images/assets/119047006/23f7f8b4-7a2d-4a5f-acdd-4f7e7af6e337",
"https://github.com/HackUniv/Images/assets/119047006/26921037-3f4f-4c2b-9f2c-d061b03ef38b",
"https://github.com/HackUniv/Images/assets/119047006/6d8802ae-15ff-409d-9297-c8554bcdeeac",
"https://github.com/HackUniv/Images/assets/119047006/0cae3dbd-1db6-4916-89da-bc910967e162",
"https://github.com/HackUniv/Images/assets/119047006/cab69b22-ff26-4917-aa3f-062235f330fe",
"https://github.com/HackUniv/Images/assets/119047006/04671b01-9dad-4f21-a2a4-5ca4d92fe425",
"https://github.com/HackUniv/Images/assets/119047006/85d4397d-c961-455c-95cd-1ebc93dc71e9"
]
const Card = ({title, content}) => (
  <div className='card' style={{overflow:'hidden'}}>
    <h3 style={{fontSize : '20px' , textAlign:'center' , fontWeight: '900' , color:'black'}}>{title}</h3>
    <img src ={content} style={{width:'19rem'}} />
  </div>
);
const Carousel = ({children}) => {
  const [active, setActive] = useState(2);
  const count = React.Children.count(children);
  return (
    <div className='carousel'>
      {active > 0 && <button className='nav left' onClick={() => setActive(i => i - 1)}><TiChevronLeftOutline/></button>}
      {React.Children.map(children, (child, i) => (
        <div className='card-container' style={{
            '--active': i === active ? 1 : 0,
            '--offset': (active - i) / 3,
            '--direction': Math.sign(active - i),
            '--abs-offset': Math.abs(active - i) / 3,
            'pointer-events': active === i ? 'auto' : 'none',
            'opacity': Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
            'display': Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
          }}>
          {child}
        </div>
      ))}
      {active < count - 1 && <button className='nav right' onClick={() => setActive(i => i + 1)}><TiChevronRightOutline/></button>}
    </div>
  );
};
const App = () => (
  <div className='app'>
    <Carousel>
      {images.map((img, i) => (
        <Card title={'Powerful Visuals About Life'} content={img}/>
      ))}
    </Carousel>
  </div>
);
ReactDOM.render(
  <App/>,
  document.body
);