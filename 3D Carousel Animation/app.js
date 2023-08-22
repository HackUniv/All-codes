import React, {useState} from 'https://cdn.skypack.dev/react';
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
const CARDS = 10;
const MAX_VISIBILITY = 3;
const images = [
"https://github.com/HackUniv/Images/assets/119047006/9531fc14-e9ef-4e40-b7b0-7c6ba9008eb4",
"https://github.com/HackUniv/Images/assets/119047006/25c8340e-df99-4c0c-b3ae-c2419d40ee90",
"https://github.com/HackUniv/Images/assets/119047006/c9f8d6ae-2a16-415e-b79f-983757d6b611",
"https://github.com/HackUniv/Images/assets/119047006/38a44d45-7de1-453f-a5f5-42c7cd1de191",
"https://github.com/HackUniv/Images/assets/119047006/7aaf1da3-a561-4b4e-a26e-0d7470b29692",
"https://github.com/HackUniv/Images/assets/119047006/65c126ba-3613-44f0-8e9c-f004c220fe86",
"https://github.com/HackUniv/Images/assets/119047006/522e9dc6-4a79-4de2-84fb-4458675b542c",
"https://github.com/HackUniv/Images/assets/119047006/68762ed6-3769-4ced-9f8e-d1ddc01e9174",
"https://github.com/HackUniv/Images/assets/119047006/bc27de3b-1b8c-46b7-87ac-efb3e32d3efd",
"https://github.com/HackUniv/Images/assets/119047006/bf5b78c4-539e-4bc0-8c50-2578b081d761",
"https://github.com/HackUniv/Images/assets/119047006/7bca20ff-faf4-463e-9267-280e12dc954c",
"https://github.com/HackUniv/Images/assets/119047006/f5ee4bbb-1e16-48d9-88f6-bbd52e8e4846",
"https://github.com/HackUniv/Images/assets/119047006/c49d4d7c-57a8-4133-9226-568997d4c0b8",
]
const Card = ({title, content}) => (
  <div className='card' style={{overflow:'hidden'}}>
    <h3 style={{fontSize : '20px' , textAlign:'center' , fontWeight: '900' , color:'black'}}>{title}</h3>
    <img src ={content} style={{width:'21rem'}} />
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
