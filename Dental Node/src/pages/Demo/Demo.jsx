import React from 'react'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
const Demo = () => {
  return (
    <div>
    <Header/>
    <div className='md:w-[70%] w-[100%] mx-auto my-40'>

    <Tabs>
    <TabList>
      <Tab>Anatomy</Tab>
      <Tab>Physiology</Tab>
      <Tab> Dental anatomy</Tab>
    </TabList>

    <TabPanel>
    <div className='flex gap-16 py-8 flex-wrap justify-center md:justify-start p-5 '>
   
    <div className='demo-box md:w-[45%] '>
    <h4 className='mb-4 text-2xl font-semibold '>Notes</h4>

    <h4 className='mb-4 text-xl  '>Scalp, temple and face 
</h4>
        <a href="./img/An-1.pdf"><img src='./img/anatomy-img.jpeg'></img></a>
    </div>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold'> Dictionary </h4>
    <h4 className='mb-4 text-xl '>Scalp, temple and face 
    </h4>
        <a href="./img/An-d.pdf"><img src='./img/anatomy-img.jpeg'></img></a>
    </div>

    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-xl '> Side of the neck </h4>
        <a href="./img/An-2-n.pdf"><img src='./img/anatomy-img.jpeg'></img></a>
    </div>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-xl '> Side of the neck </h4>
        <a href="./img/An-2-D.pdf"><img src='./img/anatomy-img.jpeg'></img></a>
    </div>
        
    </div>
    </TabPanel>
    <TabPanel>
    <div className='flex gap-16 py-8 flex-wrap justify-center md:justify-start p-5  '>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold '>Notes</h4>
    <h4 className='mb-4 text-xl '>Blood 
</h4>
        <a href="./img/Physio-1-N.pdf"><img src='./img/Physiology-demo.jpeg'></img></a>
    </div>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold'> Dictionary </h4>
    <h4 className='mb-4 text-xl '> Blood 
    </h4>
        <a href="./img/Phy-1-D.pdf"><img src='./img/Physiology-demo.jpeg'></img></a>
    </div>

    <div className='demo-box md:w-[45%]'>
   
    <h4 className='mb-4 text-xl '>Cardiovascular system 
</h4>
        <a href="./img/Physio-4-N.pdf"><img src='./img/Physiology-demo.jpeg'></img></a>
    </div>
    
    <div className='demo-box md:w-[45%]'>
    
    <h4 className='mb-4 text-xl '>Cardiovascular system 
 </h4>
        <a href="./img/Physio-4-D.pdf"><img src='./img/Physiology-demo.jpeg'></img></a>
    </div>
   
        
    </div>
    </TabPanel>
    <TabPanel>
    <div className='flex gap-16 py-8 flex-wrap justify-center md:justify-start p-5  '>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold '>Notes</h4>
    <h4 className='mb-4 text-xl  '>Introduction to dental anatomy </h4>
        <a href="./img/D-1-N.pdf"><img src='./img/anatomy-img1.jpeg'></img></a>
    </div>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold '>Dictionary</h4>
    <h4 className='mb-4 text-xl '> Introduction to dental anatomy  </h4>
        <a href="./img/D-1-D.pdf"><img src='./img/anatomy-img1.jpeg'></img></a>
    </div>

    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold '>Notes</h4>
    <h4 className='mb-4 text-xl  '>Permanent maxillary and mandibular incisors</h4>
        <a href="./img/DA-6-N.pdf"><img src='./img/anatomy-img1.jpeg'></img></a>
    </div>
    <div className='demo-box md:w-[45%]'>
    <h4 className='mb-4 text-2xl font-semibold '>Notes</h4>
    <h4 className='mb-4 text-xl  '>Permanent maxillary and mandibular incisors</h4>
        <a href="./img/DA-6-D.pdf"><img src='./img/anatomy-img1.jpeg'></img></a>
    </div>
   
        
    </div>
    </TabPanel>
  </Tabs>
    </div>
    <Footer/>
      
    </div>
  )
}

export default Demo
