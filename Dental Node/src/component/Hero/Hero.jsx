import React from 'react'
import { Link } from 'react-router-dom'
// import herobg from '/img/hero-banner.jpeg'
const Hero = () => {
  return (
    <>
      <section class="relatve mt-8 ">
  {/* <!-- Container --> */}
  <div class="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
    {/* <!-- Heading Div --> */}
    <div class="mx-auto mb-12 w-full max-w-3xl text-center md:mb-16 lg:mb-20" >
    <h1 
      data-aos="flip-down"
      class="mb-4 text-4xl font-semibold md:text-5xl !leading-snug">Learn Dental Like Never Before with <span class="bg-cover bg-center px-4 text-white shadow-[rgb(19,83,254)_6px_6px]" style={{backgroundImage: "url(/img/hero-svg-img.png)"}}>Ajay kumar BDS</span></h1>

      <p class="mx-auto mb-5 max-w-[528px] text-xl text-[black] lg:mb-8 ">The Ultimate Destination for BDS Students!
      Get access to detailed, compact, and clinically-relevant notes that simplify your studies and help you excel.</p>
      <p class="mx-auto mb-5 max-w-[528px] text-xl font-semibold text-[#ef305c] underline lg:mb-8 ">India's best self understandable notes</p>
      {/* <!-- Button Wrap --> */}
      <div class="grid grid-cols-2 gap-4 md:flex md:justify-center md:gap-6">
        <Link to='/notessubject?year=1st'
        data-aos="fade-up"
         class="flex max-w-full flex-row items-center justify-center rounded-xl border border-solid border-[#ef305c] px-6 py-3 font-semibold text-[#ef305c] [box-shadow:rgb(19,_83,_254)_6px_6px]">
          <img src="./img/pdf-logo.jpeg" alt="" class="mr-2 inline-block w-6" />
          <p class="text-black hover:text-[#ef305c] ">1st Year </p>
        </Link>
       <Link to='/notessubject?year=2nd' 
        data-aos="fade-up"
        class="flex max-w-full flex-row items-center justify-center rounded-xl border border-solid border-[#ef305c] px-6 py-3 font-semibold text-[#ef305c] [box-shadow:rgb(19,_83,_254)_6px_6px]">
          <img src="./img/pdf-logo.jpeg" alt="" class="mr-2 inline-block w-6" />
          <p class="text-black hover:text-[#ef305c] ">2nd Year </p>
        </Link>
        <Link to='/notessubject?year=3rd' 
        data-aos="fade-up"
        class="flex max-w-full flex-row items-center justify-center rounded-xl border border-solid border-[#ef305c] px-6 py-3 font-semibold text-[#ef305c] [box-shadow:rgb(19,_83,_254)_6px_6px]">
          <img src="./img/pdf-logo.jpeg" alt="" class="mr-2 inline-block w-6" />
          <p class="text-black hover:text-[#ef305c] ">3rd Year </p>
        </Link>
        <Link to='/notessubject?year=4th' 
        data-aos="fade-up"
        class="flex max-w-full flex-row items-center justify-center rounded-xl border border-solid border-[#ef305c] px-6 py-3 font-semibold text-[#ef305c] [box-shadow:rgb(19,_83,_254)_6px_6px]">
          <img src="./img/pdf-logo.jpeg" alt="" class="mr-2 inline-block w-6" />
          <p class="text-black hover:text-[#ef305c] ">4th Year </p>
        </Link>
      </div>
    </div>
    {/* <!-- Image Div --> */}
    <div class="relative mx-auto md:h-[512px]" data-aos="flip-left">
      <img src="/img/hero-banner.jpeg" alt="" class="inline-block h-full w-full rounded-xl object-cover sm:rounded-2xl" />
      <div class="absolute bottom-0 left-4 right-0 top-4 -z-10 h-full w-full rounded-2xl bg-black"></div>
    </div>
  </div>
 
  <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905b9f809b5c8180ce30c5_pattern-1.svg" alt="" class="absolute bottom-0 left-0 right-auto top-auto -z-10 inline-block md:bottom-1/2 md:left-0 md:right-auto md:top-auto" />
  <img src="https://assets.website-files.com/63904f663019b0d8edf8d57c/63905ba1538296b3f50a905e_pattern-2.svg" alt="" class="absolute bottom-auto left-auto right-0 top-0 -z-10 hidden sm:inline-block" />
</section>
    </>
    
  )
}

export default Hero
