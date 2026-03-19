import { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="contact-form-container">
            <h2>Contact Us</h2>
            <p>Have questions? We&apos;d love to hear from you.</p>
            {submitted ? (
                <div className="success-message">Thanks for reaching out! We&apos;ll get back to you shortly.</div>
            ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name"
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email"
                            id="email" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea 
                            id="message"
                            required 
                            value={formData.message}
                            rows="4"
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="submit-button">Send Message</button>
                </form>
            )}
        </div>
    );
};

export default ContactForm;
