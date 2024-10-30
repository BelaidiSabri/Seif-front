import React, { useState } from 'react';
import '../../CSS/NouveauOffre.css';

const NouveauOffre = () => {
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [domain, setDomain] = useState('Etudiant');
  const [community, setCommunity] = useState('livres 3eme années');
  const [type, setType] = useState('Vendre');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...images, URL.createObjectURL(e.target.files[0])]);
  };

  const handleSubmit = () => {
    // Handle the submit logic here
  };

  return (
    <div className="share-offer">
      <h2>Partager un nouveau offre</h2>
      <form onSubmit={handleSubmit}>
        
          <label className="lbl-info-g">
            Titre:
            <input  className="inpt-info-g" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
        <label className="lbl-info-g">
          Téléphone:
          <input className="inpt-info-g" placeholder=' +216..'  type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="lbl-info-g">
          Adresse:
          <input className="inpt-info-g"  type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <div className="right-accueil">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104888.664870107!2d10.65052600104041!3d34.761366629741254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13002cda1486c695%3A0x22dfe0a62c50ce6f!2sSfax!5e0!3m2!1sfr!2stn!4v1717066623257!5m2!1sfr!2stn"
            width="100%"
            height="100%"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <label className="lbl-info-g">
          Domaine:
          <select value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="Etudiant">Etudiant</option>
            <option value="Etudiant1">Etudiant1</option>
            <option value="Etudiant2">Etudiant2</option>
            <option value="Etudiant3">Etudiant3</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <label className="lbl-info-g">
          Communauté:
          <select value={community} onChange={(e) => setCommunity(e.target.value)}>
            <option value="livres 3eme années">livres 3eme années</option>
            <option value="livres 4eme années">livres 4eme années</option>
            <option value="livres 5eme années">livres 5eme années</option>
            <option value="livres 6eme années">livres 6eme années</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <br/>
        <div className='deux-ona'>
          <label className="lbl-info-g">
          Type:
          <select style={{width:"20rem",margin:"0px 20px"}} value={type} onChange={(e) => setType(e.target.value)}>
            <option  value="Vendre">Vendre</option>
            {/* Add more options as needed */}
          </select>
          </label>
          <label className="lbl-info-g">
          Prix:
          <input  style={{width:"20rem",margin:"0px 20px" }}  className="inpt-info-g"  type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
        </div>  
        <label  className="lbl-info-g">
          Description:
          <textarea  value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </label>
        <label className="lbl-info-g">
          Images:
          <input className="inpt-info-g"  type="file" onChange={handleImageChange} />
          <div className="image-preview">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Preview ${index}`} />
            ))}
          </div>
        </label>
        <div className='deux-butt'>
          <button  type="submit">Partager</button>
          <button  type="button" onClick={() => { /* handle cancel logic */ }}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default NouveauOffre;
