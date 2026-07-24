import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventForm from '../components/EventForm';
import { eventService } from '../services/eventService';

const initialValues = {
  title: '',
  description: '',
  category: '',
  date: '',
  time: '',
  venue: '',
  city: '',
  price: '',
  capacity: ''
};

const CreateEvent = () => {
  const [values, setValues] = useState(initialValues);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => setValues({ ...values, [event.target.name]: event.target.value });

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0];
    setFile(nextFile || null);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append('image', file);

    setLoading(true);
    try {
      const { data } = await eventService.createEvent(formData);
      toast.success(data.message || 'Event created');
      navigate(`/events/${data.event._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-panel">
      <span className="eyebrow">Create Event</span>
      <h1>Create a new event</h1>
      <EventForm values={values} onChange={handleChange} onImageChange={handleImageChange} imagePreview={preview} onSubmit={handleSubmit} submitLabel={loading ? 'Saving...' : 'Create Event'} />
    </section>
  );
};

export default CreateEvent;