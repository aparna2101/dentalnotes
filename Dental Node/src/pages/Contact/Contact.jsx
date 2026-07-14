import React from 'react'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'
import { Link } from 'react-router-dom'
const Contact = () => {
  return (
   <>
   <Header/>
     <div>
      <div class="container mt-12 mx-auto px-2 md:px-16 pt-24 max-w-[1000px]">
        {/* Back to Home Button */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button 
              style={{ 
                color: "#333", 
                fontWeight: "bold", 
                fontSize: "1.1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0"
              }}
            >
              <span style={{ marginRight: '8px', fontSize: '1.4rem' }}>←</span> Home
            </button>
          </Link>
        </div>

<section class="mb-32">

    <div class="flex justify-center">
        <div class="text-center md:max-w-xl lg:max-w-3xl">
            <h2 class="mb-12 px-6 text-3xl font-bold">
                Contact us
            </h2>
        </div>
    </div>

    <div class="flex flex-wrap">

        <form action='https://api.web3forms.com/submit' class="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6 bg-[#f4f4f4] p-8">
        <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE"/>
            <div class="mb-3 w-full">
                <label class="block font-medium mb-[2px] text-teal-700" htmlFor="exampleInput90">
                        Name
                </label>
                <input type="text" name="name" class="px-2 py-2 border w-full outline-none rounded-md" id="exampleInput90" placeholder="Name" />
            </div>

            <div class="mb-3 w-full">
                <label class="block font-medium mb-[2px] text-teal-700" htmlFor="exampleInput90">
                        Email
                </label>
                <input type="email" name="email" class="px-2 py-2 border w-full outline-none rounded-md" id="exampleInput90"
                        placeholder="Enter your email address" />
            </div>
            <div class="mb-3 w-full">
                <label class="block font-medium mb-[2px] text-teal-700" htmlFor="exampleInput90">
                        Number
                </label>
                <input type="text" name="number" class="px-2 py-2 border w-full outline-none rounded-md" id="exampleInput90"
                        placeholder="Enter your email address" />
            </div>

            <div class="mb-3 w-full">
                <label class="block font-medium mb-[2px] text-teal-700" htmlFor="exampleInput90">
                        Message
                </label>
                <textarea class="px-2 py-2 border rounded-[5px] w-full outline-none" name="message" id=""></textarea>
            </div>

            <button type="submit"
                    class="mb-6 inline-block w-full rounded bg-teal-400 px-6 py-2.5 font-medium uppercase leading-normal text-white hover:shadow-md hover:bg-teal-500">
                    Send
            </button>

        </form>

        <div class="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
            <div class="flex flex-wrap">
                <div class="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
                    <div class="flex items-start">
                        <div class="shrink-0">
                            <div class="inline-block rounded-md bg-teal-400-100 p-4 text-teal-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="2" stroke="currentColor" class="h-6 w-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                                </svg>
                            </div>
                        </div>
                        <div class="ml-6 grow">
                            <p class="mb-2 font-bold">
                                Technical support
                            </p>
                            <p class="text-neutral-500 ">
                            ajayk061999@gmail.com
                            </p>
                            <p class="text-neutral-500 ">
                                +91 9354169122
                            </p>
                        </div>
                    </div>
                </div>
               
               
                <div class="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:px-6">
                    <div class="align-start flex">
                        <div class="shrink-0">
                           
                        </div>
                        <div class="ml-6 grow">
                        <p class="mb-2 font-bold">
                                Address
                            </p>
                            <p class="text-neutral-500 ">
                            D-37,, VILLAGE GHAROLI , MAYUR VIHAR PHASE-3 VASUNDHRA ENCLAVE, East Delhi, 09-Delhi, 91-INDIA
                            </p>
                           
                        </div>
                    </div>
                    
                </div>
                <div class="mb-12 w-full shrink-0 grow-0 basis-auto  md:px-3 lg:px-6">
                    <div class="align-start flex">
                        
                        <div class="ml-6 grow">
                           
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14011.737897642932!2d77.29832291714322!3d28.60174249720929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4ef040d4803%3A0x9007f0b3bef4a434!2sVasundhara%20Enclave%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1736525958420!5m2!1sen!2sin" width="100%" height="250" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
              
                    
                </div>
             
            </div>
        </div>

    </div>
</section>


</div>
    </div>
    <Footer/>
   </>
  )
}

export default Contact

