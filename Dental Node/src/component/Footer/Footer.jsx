import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <div>
    <div class="whatapp" >
      <div class="whatsapp-popup" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', padding: '6px 12px', whiteSpace: 'nowrap', lineHeight: '1.3' }}>
        <span>Need Help?</span>
        <span style={{ fontWeight: '500', fontSize: '10px', marginTop: '1px' }}>Message Us</span>
        <div class="popup-arrow"></div>
      </div>
      <a href="https://api.whatsapp.com/send?phone=9354169122" class="whatsapp-icon-btn">
        <img src="./img/icon.png" alt=""/>
      </a>
    </div>

      <footer class="w-full bg-[#15bedf]">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* <!--Grid--> */}
            <div class="py-16 flex justify-between items-center flex-col gap-8 lg:flex-row">
                <a href="https://pagedone.io/"  class="flex justify-center ">
                    <img src="/img/newLogo.png" class="h-24 w-auto" alt="Pagedone" />
                        
                </a>
                <ul class="text-lg text-center sm:flex items-cente justify-center gap-14 lg:gap-10 xl:gap-14 transition-all duration-500">
                    <li ><Link to="/notessubject"  class="text-white hover:text-gray-400">Notes</Link></li>
                    <li class="sm:my-0 my-2" ><Link to='/contact'  class="text-white hover:text-gray-400">Contact Us</Link></li>
                    <li class="sm:my-0 my-2" ><Link to='/RefundPolicy'  class="text-white hover:text-gray-400">Refund Policy</Link></li>
                    <li class="sm:my-0 my-2" ><Link to='/Terms&conditions'  class="text-white hover:text-gray-400">Terms & conditions</Link></li>
                    <li class="sm:my-0 my-2" ><Link to='/PrivacyPolicy'  class="text-white hover:text-gray-400">Privacy Policy</Link></li>
                </ul>                <div class="flex space-x-4 sm:justify-center">
                    {/* Telegram Icon */}
                    <a href="https://t.me/releaseexampressure" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 flex justify-center items-center hover:bg-[#0088cc] transition-colors">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.99.54-1.41.53-.46-.01-1.34-.26-2-.48-.8-.27-1.44-.42-1.39-.89.03-.25.38-.51 1.07-.78 4.2-1.82 7-3.03 8.4-3.61 4-.17 4.83.69 4.84.8z"/>
                        </svg>
                    </a>
                    {/* YouTube Icon */}
                    <a href="https://youtube.com/@releaseexampressure?si=k07OfLokuWS_Dna0" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 flex justify-center items-center hover:bg-[#ff0000] transition-colors">
                        <svg class="w-[1.25rem] h-[0.875rem] text-white" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9346 1.13529C14.5684 1.30645 15.0665 1.80588 15.2349 2.43896C15.5413 3.58788 15.5413 5.98654 15.5413 5.98654C15.5413 5.98654 15.5413 8.3852 15.2349 9.53412C15.0642 10.1695 14.5661 10.669 13.9346 10.8378C12.7886 11.1449 8.19058 11.1449 8.19058 11.1449C8.19058 11.1449 3.59491 11.1449 2.44657 10.8378C1.81277 10.6666 1.31461 10.1672 1.14622 9.53412C0.839844 8.3852 0.839844 5.98654 0.839844 5.98654C0.839844 5.98654 0.839844 3.58788 1.14622 2.43896C1.31695 1.80353 1.81511 1.30411 2.44657 1.13529C3.59491 0.828125 8.19058 0.828125 8.19058 0.828125C8.19058 0.828125 12.7886 0.828125 13.9346 1.13529ZM10.541 5.98654L6.72178 8.19762V3.77545L10.541 5.98654Z" fill="currentColor"/>
                        </svg>
                    </a>
                    {/* Instagram Icon */}
                    <a href="https://www.instagram.com/release_exam_pressure?igsh=MTd4cGFtemEzaDdsdw==" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-gray-800 flex justify-center items-center hover:bg-[#e1306c] transition-colors">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                        </svg>
                    </a>
                </div>
            </div>
            {/* <!--Grid--> */}
            <div class="py-7 border-t border-gray-700">
                <div class="flex items-center justify-center">
                    <span class="text-white ">©<a href="">copyright</a>2024, All rights reserved.</span>
                </div>
            </div>
        </div>
    </footer>
    </div>
  )
}

export default Footer
