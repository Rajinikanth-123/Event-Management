import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import EventForm from '../components/EventForm';
import Loader from '../components/Loader';
import { eventService } from '../services/eventService';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventService.getEventById(id);
        const event = data.event;
        setValues({
          title: event.title || '',
          description: event.description || '',
          category: event.category || '',
          date: event.date ? new Date(event.date).toISOString().slice(0, 10) : '',
          time: event.time || '',
          venue: event.venue || '',
          city: event.city || '',
          price: event.price ?? '',
          capacity: event.capacity ?? ''
        });
        setPreview(event.image || '');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (event) => setValues({ ...values, [event.target.name]: event.target.value });
  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0];
    setFile(nextFile || null);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : preview);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append('image', file);

    setSaving(true);
    try {
      const { data } = await eventService.updateEvent(id, formData);
      toast.success(data.message || 'Event updated');
      navigate(`/events/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !values) {
    return <Loader label="Loading event" />;
  }

  return (
    <section className="page-panel">
      <span className="eyebrow">Edit Event</span>
      <h1>Edit your event</h1>
      <EventForm values={values} onChange={handleChange} onImageChange={handleImageChange} imagePreview={preview} onSubmit={handleSubmit} submitLabel={saving ? 'Updating...' : 'Update Event'} />
    </section>
  );
};

export default EditEvent;