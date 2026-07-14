import React from 'react'
import Header from '../../component/Header/Header'
import Footer from '../../component/Footer/Footer'
import { Link } from 'react-router-dom'

const Notes = () => {
  return (

    <>

    <Header/>
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32 mb-8" >
 <div className='flex justify-center gap-8 flex-wrap md:flex-nowrap'>
 
 <div className=''>
 <a class="p-8 max-w-lg border border-indigo-300 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 flex flex-col items-center"
    href="#">
    <img src="/img/general.jpeg" class="shadow rounded-lg overflow-hidden border" />
    <div class="mt-8">
        <h4 class="font-bold text-xl">General Medicine</h4>
        <p class="mt-2 text-gray-600">Perfect for Quick learning and clinical success.
        </p>
        <div class="mt-5">
            <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900">
            <Link to='/NotesSubject'>
            Read More
            </Link>
            </button>
        </div>
    </div>
</a>
 </div>

 <div className=''>
 <a class="p-8 max-w-lg border border-indigo-300 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 flex flex-col items-center"
    href="#">
    <img src="/img/general2.jpeg" class="shadow rounded-lg overflow-hidden border" />
    <div class="mt-8">
        <h4 class="font-bold text-xl">General Surgery</h4>
        <p class="mt-2 text-gray-600">Clear conicise and ready to boost your performance.
        </p>
        <div class="mt-5">
            <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900">
            <Link to='/NotesSubject'>
            Read More
            </Link>
            </button>
        </div>
    </div>
</a>
 </div>

 <div className=''>
 <a class="p-8 max-w-lg border border-indigo-300 rounded-2xl hover:shadow-xl hover:shadow-indigo-50 flex flex-col items-center"
    href="#">
    <img src="/img/oral.jpeg" class="shadow rounded-lg overflow-hidden border" />
    <div class="mt-8">
        <h4 class="font-bold text-xl">Oral Pathology</h4>
        <p class="mt-2 text-gray-600">Perfect for exam perparatiion and clinical application.
        </p>
        <div class="mt-5">
            <button type="button" class="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-gray-900">
            
            <Link to='/NotesSubject'>
            Read More
            </Link></button>
        </div>
    </div>
</a>
 </div>

 </div>
    
    </div>
    <Footer/>
    </>
   
  )
}

export default Notes
