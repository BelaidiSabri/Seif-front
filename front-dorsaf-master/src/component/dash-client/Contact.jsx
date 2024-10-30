import React from 'react'
import Footer from './Footer'

function Contact() {
  return (
    <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104888.664870107!2d10.65052600104041!3d34.761366629741254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002cda1486c695%3A0x22dfe0a62c50ce6f!2sSfax!5e0!3m2!1sfr!2stn!4v1717066623257!5m2!1sfr!2stn"
            width="100%"
            height="650"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <br/>
          <br/>
          <Footer/>
    </div>
  )
}

export default Contact