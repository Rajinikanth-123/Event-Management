import { categories } from '../utils/constants';

const EventForm = ({ values, onChange, onSubmit, onImageChange, imagePreview, submitLabel = 'Save Event' }) => {
  return (
    <form className="form-shell event-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          <span>Event Title</span>
          <input name="title" value={values.title} onChange={onChange} required />
        </label>
        <label>
          <span>Category</span>
          <select name="category" value={values.category} onChange={onChange} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Date</span>
          <input type="date" name="date" value={values.date} onChange={onChange} required />
        </label>
        <label>
          <span>Time</span>
          <input type="time" name="time" value={values.time} onChange={onChange} required />
        </label>
        <label>
          <span>Venue</span>
          <input name="venue" value={values.venue} onChange={onChange} required />
        </label>
        <label>
          <span>City</span>
          <input name="city" value={values.city} onChange={onChange} required />
        </label>
        <label>
          <span>Price</span>
          <input type="number" min="0" name="price" value={values.price} onChange={onChange} />
        </label>
        <label>
          <span>Maximum Capacity</span>
          <input type="number" min="1" name="capacity" value={values.capacity} onChange={onChange} required />
        </label>
      </div>
      <label>
        <span>Description</span>
        <textarea name="description" rows="6" value={values.description} onChange={onChange} required />
      </label>
      <label>
        <span>Banner Image Upload</span>
        <input type="file" accept="image/*" onChange={onImageChange} />
      </label>
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Event preview" />
        </div>
      )}
      <button type="submit" className="primary-button">
        {submitLabel}
      </button>
    </form>
  );
};

export default EventForm;