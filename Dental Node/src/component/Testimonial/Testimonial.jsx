import React from 'react'

const Testimonial = () => {
  return (
    <div>
      <section id="testimonials" aria-label="What our User are saying" class="bg-slate-50 py-20 sm:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl md:text-center">
      <h2 class="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl text-blk heading">What Our Users Are Saying</h2>
    </div>
    <ul role="list"
      class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
      <li>
        <ul role="list" class="flex flex-col gap-y-6 sm:gap-y-8">
          <li>
            <figure class="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
              <blockquote class="relative">
                <p class="text-lg tracking-tight text-slate-900">This website is a goldmine for dental students! The chapter-wise content, neatly organized into PDFs, is extremely helpful. The notes are in simple language, making even complex topics easy to understand. The addition of a dictionary for quick reference is a game-changer. Whether you're preparing for exams or brushing up on topics, this site has got you covered. Highly recommended.</p>
              </blockquote>
              <figcaption class="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  <div class="font-display text-base text-slate-900">Rahul Kumar</div>
                </div>
                <div class="overflow-hidden rounded-full bg-slate-50">
                  <img alt="" class="h-14 w-14 object-cover" style={{color:"transparent"}} src="https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"/>
                </div>
              </figcaption>
            </figure>
          </li>
        </ul>
      </li>
      <li>
        <ul role="list" class="flex flex-col gap-y-6 sm:gap-y-8">
          <li>
            <figure class="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
              <blockquote class="relative">
                <p class="text-lg tracking-tight text-slate-900">A truly impressive resource for dental students. The website offers structured, chapter-wise notes that are concise yet detailed. The dictionary feature is an excellent addition, especially for decoding technical jargon. The ease of understanding and organized format make it a go-to platform for anyone in the dental field. It's like having a personal tutor available 24/7. Absolutely worth exploring.</p>
              </blockquote>
              <figcaption class="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  <div class="font-display text-base text-slate-900">priya singh</div>
                </div>
                <div class="overflow-hidden rounded-full bg-slate-50">
                  <img alt="" class="h-14 w-14 object-cover" style={{color:"transparent"}} src="https://static.vecteezy.com/system/resources/previews/026/843/137/non_2x/beautiful-flowers-with-beautiful-scenery-ai-image-generate-free-photo.jpg"/>
                </div>
              </figcaption>
            </figure>
          </li>
        </ul>
      </li>
      <li>
        <ul role="list" class="flex flex-col gap-y-6 sm:gap-y-8">
          <li>
            <figure class="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
              <blockquote class="relative">
                <p class="text-lg tracking-tight text-slate-900">Chapter-wise dental notes ka collection aur uska PDF format me available hona toh next-level hai. Dictionary feature bhi hai jo tricky terms ko turant samajhne me help karta hai. Content easy language me diya gaya hai, toh samajhne me bilkul dikkat nahi hoti. Ek dental student ke liye isse perfect resource aur kya ho sakta hai? Seriously, must-visit site hai</p>
              </blockquote>
              <figcaption class="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  <div class="font-display text-base text-slate-900">Vishal yadav</div>
                </div>
                <div class="overflow-hidden rounded-full bg-slate-50">
                  <img alt="" class="h-14 w-14 object-cover" style={{color:"transparent"}} src="https://img.artpal.com/501431/3-19-9-25-15-39-55m.jpg"/>
                </div>
              </figcaption>
            </figure>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</section>
    </div>
  )
}

export default Testimonial
