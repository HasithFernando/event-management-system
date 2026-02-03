'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { eventService } from '../../../services/eventService';
import { CreateEventRequest, EventCategory } from '../../../types';
import { getErrorMessage } from '../../../lib/api';

export default function CreateEventPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    const [formData, setFormData] = useState<Partial<CreateEventRequest>>({
        title: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        address: '',
        capacity: 0,
        price: 0,
        category: 'CONFERENCE' as EventCategory,
        imageUrls: [''],
        featured: false,
    });

    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login?redirect=/events/create');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="spinner"></div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        if (!user) {
            setFormError('You must be logged in to create an event.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Format times to ensure HH:mm:ss format if needed, though simple HH:mm often works depending on backend
            // Java LocalTime usually accepts HH:mm:ss. Let's append :00 if missing.
            const startTimeFormatted = formData.startTime?.length === 5 ? `${formData.startTime}:00` : formData.startTime;
            const endTimeFormatted = formData.endTime?.length === 5 ? `${formData.endTime}:00` : formData.endTime;

            const payload: CreateEventRequest = {
                title: formData.title!,
                description: formData.description!,
                eventDate: formData.eventDate!,
                startTime: startTimeFormatted!,
                endTime: endTimeFormatted!,
                location: formData.location!,
                address: formData.address,
                capacity: Number(formData.capacity),
                price: Number(formData.price),
                category: formData.category as EventCategory,
                organizerId: user.id,
                organizerName: `${user.firstName} ${user.lastName}`,
                imageUrls: formData.imageUrls?.filter(url => url.trim() !== '') || [],
                thumbnailUrl: formData.imageUrls?.[0] || '',
                featured: formData.featured || false,
            };

            await eventService.createEvent(payload);
            router.push('/events'); // Redirect to events list
        } catch (err) {
            console.error('Failed to create event:', err);
            setFormError(getErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories: EventCategory[] = [
        'CONFERENCE', 'WORKSHOP', 'SEMINAR', 'CONCERT',
        'SPORTS', 'EXHIBITION', 'NETWORKING', 'PARTY',
        'CHARITY', 'EDUCATION', 'TECHNOLOGY', 'BUSINESS',
        'ARTS', 'FOOD', 'HEALTH', 'OTHER'
    ];

    return (
        <div className="section">
            <div className="max-w-3xl mx-auto">
                <div className="card">
                    <div className="section-header">
                        <h1 className="section-title text-3xl">Create New Event</h1>
                        <p className="section-subtitle">Host your own amazing event</p>
                    </div>

                    {formError && (
                        <div className="alert alert-error mb-6">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title">Event Title</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Annual Tech Conference 2024"
                            />
                        </div>

                        {/* Category & Price - Grid */}
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Date & Time - Grid */}
                        <div className="grid grid-3">
                            <div className="form-group">
                                <label htmlFor="eventDate">Date</label>
                                <input
                                    id="eventDate"
                                    name="eventDate"
                                    type="date"
                                    required
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="startTime">Start Time</label>
                                <input
                                    id="startTime"
                                    name="startTime"
                                    type="time"
                                    required
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="endTime">End Time</label>
                                <input
                                    id="endTime"
                                    name="endTime"
                                    type="time"
                                    required
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Location & Address */}
                        <div className="form-group">
                            <label htmlFor="location">Venue Name / Location</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Grand Convention Center"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Full Address</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g. 123 Main St, New York, NY"
                            />
                        </div>

                        {/* Capacity */}
                        <div className="form-group">
                            <label htmlFor="capacity">Total Capacity</label>
                            <input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                required
                                value={formData.capacity}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your event..."
                            />
                        </div>

                        {/* Image URL (Simple placeholder for now) */}
                        <div className="form-group">
                            <label htmlFor="imageUrl">Cover Image URL</label>
                            <input
                                id="imageUrl"
                                name="imageUrls"
                                type="url"
                                value={formData.imageUrls?.[0] || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrls: [e.target.value] }))}
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-sm text-gray-500 mt-1">Provide a direct link to an image.</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner w-5 h-5 border-2"></span>
                                        Creating...
                                    </>
                                ) : (
                                    'Create Event'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
