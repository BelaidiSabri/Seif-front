import React, { useState, useEffect } from 'react';
import '../../../CSS/NouveauOffre.css';
import axios from 'axios';
import Cookies from "js-cookie"
import Map from '../Map';
import LocationPicker from '../LocationPicker';
import cities from '../../../data/cities';
import { categories } from './categories';

const NouveauOffre = ({ productToEdit }) => {
  const initialState = {
    nom: "",
    description: "",
    prix: "",
    quantityDispo: "",
    communauté: "",
    adresse: "",
    images: [],
    status: "",
    numtel: "",
    domaine: "",
    categorie: "",
    ville: "",
    coordinates: null, // Add coordinates field to the initial state
  };

  const [offer, setOffer] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [newCommunity, setNewCommunity] = useState('');
  const [communities, setCommunities] = useState([
    'livres 3eme années',
    'livres 4eme années',
    'livres 5eme années',
    'livres 6eme années',
  ]);

  const token = Cookies.get('token');

  useEffect(() => {
    if (productToEdit) {
      setOffer({ ...productToEdit });
    }
  }, [productToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!offer.nom.trim()) newErrors.nom = "Le titre est requis";
    if (!offer.categorie) newErrors.categorie = "La sous-catégorie est requise";
    if (!offer.description.trim()) newErrors.description = "La description est requise";
    if (!offer.adresse.trim()) newErrors.adresse = "L'adresse est requise";
    if (!offer.status) newErrors.status = "Le type est requis";

    if (offer.status === "vente") {
      if (!offer.prix) newErrors.prix = "Le prix est requis pour une vente";
      else if (isNaN(offer.prix) || Number(offer.prix) <= 0) newErrors.prix = "Le prix doit être un nombre positif";
    }

    if (offer.images.length === 0) newErrors.images = "Au moins une image est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: "Le fichier doit être une image" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: "L'image ne doit pas dépasser 5MB" }));
        return;
      }

      setOffer(prevOffer => ({
        ...prevOffer,
        images: [...prevOffer.images, file],
      }));
      setErrors(prev => ({ ...prev, images: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validateForm()) {
      setSubmitError("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.keys(offer).forEach(key => {
        if (key !== "images") {
          const value = offer[key];
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
      });

      offer.images.forEach((image) => {
        formData.append('images', image);
      });

      let res;
      if (productToEdit) {
        res = await axios.put(`http://localhost:5000/product/${productToEdit.id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setSubmitSuccess("Offre mise à jour avec succès!");
      } else {
        res = await axios.post('http://localhost:5000/product', formData, { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          } 
        });
        setSubmitSuccess("Offre publiée avec succès!");
      }

      setOffer(initialState);
      setTimeout(() => setSubmitSuccess(""), 5000);
    } catch (error) {
      console.error('Error submitting offer:', error);
      setSubmitError(error.response?.data?.message || "Une erreur s'est produite lors de la publication de l'offre. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunity = () => {
    if (!newCommunity.trim()) {
      setErrors(prev => ({ ...prev, newCommunity: "La communauté ne peut pas être vide" }));
      return;
    }
    if (communities.includes(newCommunity)) {
      setErrors(prev => ({ ...prev, newCommunity: "Cette communauté existe déjà" }));
      return;
    }

    setCommunities([...communities, newCommunity]);
    setOffer({ ...offer, communauté: newCommunity });
    setNewCommunity('');
    setErrors(prev => ({ ...prev, newCommunity: null }));
  };

  const handleInputChange = (e, field) => {
    setOffer({ ...offer, [field]: e.target.value });
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="share-offer">
      <h2>{productToEdit ? "Mettre à jour l'offre" : "Partager un nouveau offre"}</h2>

      {submitError && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{submitError}</div>}
      {submitSuccess && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{submitSuccess}</div>}

      <form onSubmit={handleSubmit}>
        <label className="lbl-info-g">
          Titre:
          <input 
            className={`inpt-info-g ${errors.nom ? 'error-input' : ''}`}
            type="text" 
            value={offer.nom} 
            onChange={(e) => handleInputChange(e, 'nom')}
          />
          {errors.nom && <span className="error-text">{errors.nom}</span>}
        </label>

        <label className="lbl-info-g">
          Catégorie:
          <select 
            className={`inpt-info-g ${errors.categorie ? 'error-input' : ''}`}
            value={offer.categorie}
            onChange={(e) => handleInputChange(e, 'categorie')}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <React.Fragment key={category.id}>
                <option value="" disabled style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                  {category.name}
                </option>
                {category.subcategories.map(sub => (
                  <option 
                    key={`${category.id}-${sub}`} 
                    value={sub}
                    style={{ paddingLeft: '20px' }}
                  >
                    {sub}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </select>
          {errors.categorie && <span className="error-text">{errors.categorie}</span>}
        </label>

        <label className="lbl-info-g">
          Téléphone:
          <input 
            className={`inpt-info-g ${errors.numtel ? 'error-input' : ''}`}
            placeholder='+216..' 
            type="text" 
            value={offer.numtel} 
            onChange={(e) => handleInputChange(e, 'numtel')}
          />
          {errors.numtel && <span className="error-text">{errors.numtel}</span>}
        </label>

        <label className="lbl-info-g">
          Adresse:
          <input 
            className={`inpt-info-g ${errors.adresse ? 'error-input' : ''}`}
            type="text" 
            value={offer.adresse} 
            onChange={(e) => handleInputChange(e, 'adresse')}
          />
          {errors.adresse && <span className="error-text">{errors.adresse}</span>}
        </label>

        <label className="lbl-info-g">
          Ville:
          <select 
            className={`inpt-info-g ${errors.ville ? 'error-input' : ''}`}
            value={offer.ville || ''}
            onChange={(e) => {
              const selectedCity = cities.find(city => city.name === e.target.value);
              if (selectedCity) {
                setOffer(prevOffer => ({
                  ...prevOffer,
                  ville: selectedCity.name,
                }));
              }
            }}
          >
            <option value="">Sélectionner une ville pour naviguer</option>
            {cities.map(city => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.ville && <span className="error-text">{errors.ville}</span>}
        </label>

        <LocationPicker 
          cityCoordinates={cities.find(city => city.name === offer.ville)?.coordinates}
          offer={offer}
          setOffer={setOffer}
        />

        <label className="lbl-info-g">
          Description:
          <textarea 
            className={`inpt-info-g ${errors.description ? 'error-input' : ''}`} 
            value={offer.description} 
            onChange={(e) => handleInputChange(e, 'description')}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </label>

        <label className="lbl-info-g">
          Images:
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {errors.images && <span className="error-text">{errors.images}</span>}
        </label>

        <label className="lbl-info-g">
          Statut:
          <select 
            className={`inpt-info-g ${errors.status ? 'error-input' : ''}`}
            value={offer.status} 
            onChange={(e) => handleInputChange(e, 'status')}
          >
            <option value="vente">Vente</option>
            <option value="echange">Échange</option>
          </select>
          {errors.status && <span className="error-text">{errors.status}</span>}
        </label>

        <label className="lbl-info-g">
          Prix:
          <input 
            className={`inpt-info-g ${errors.prix ? 'error-input' : ''}`}
            type="number" 
            value={offer.prix} 
            onChange={(e) => handleInputChange(e, 'prix')}
          />
          {errors.prix && <span className="error-text">{errors.prix}</span>}
        </label>

        <label className="lbl-info-g">
          Quantité disponible:
          <input 
            className={`inpt-info-g ${errors.quantityDispo ? 'error-input' : ''}`} 
            type="number" 
            value={offer.quantityDispo} 
            onChange={(e) => handleInputChange(e, 'quantityDispo')}
          />
          {errors.quantityDispo && <span className="error-text">{errors.quantityDispo}</span>}
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Chargement..." : productToEdit ? "Mettre à jour l'offre" : "Partager l'offre"}
        </button>
      </form>
    </div>
  );
};

export default NouveauOffre;
