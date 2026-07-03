import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const token = localStorage.getItem('access');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('finance/categories/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const onSubmit = async (data) => {
        try {
            await api.post('finance/categories/', data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            reset();
            fetchCategories();
        } catch (err) {
            console.error('Error creating category:', err.response?.data || err.message);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`finance/categories/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to delete category.");
        }
    };

    const defaultCategories = categories.filter(cat => cat.is_default);
    const customCategories = categories.filter(cat => !cat.is_default);

    return (
        <div className="container mt-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">

                <h2 className="fw-bold text-primary mb-0">
                    📂 Manage Categories
                </h2>

                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">

                    <div className="col-12 col-md-5">
                        <input
                            className="form-control"
                            placeholder="Category Name"
                            {...register("name")}
                            required
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <select
                            className="form-select"
                            {...register("type")}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-3">
                        <button
                            type="submit"
                            className="btn btn-success w-100"
                        >
                            Add Category
                        </button>
                    </div>

                </div>
            </form>

            {categories.length === 0 ? (
                <p>No categories found.</p>
            ) : (
                <>
                    {/* Default Categories */}
                    <h4 className="mt-4 mb-3">Default Categories</h4>

                    <ul className="list-group mb-4">
                        {defaultCategories.map(cat => (
                            <li key={cat.id} className="list-group-item">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">

                                    <div>
                                        <strong>{cat.name}</strong>

                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            <span
                                                className={`badge ${cat.type === "INCOME"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                                    }`}
                                            >
                                                {cat.type}
                                            </span>

                                            <span className="badge bg-secondary">
                                                Default
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* User Categories */}
                    <h4 className="mb-3">My Categories</h4>

                    {customCategories.length === 0 ? (
                        <div className="alert alert-light border text-center">
                            <h5>📂 No custom categories yet</h5>
                            <p className="mb-0">
                                Create your first category using the form above.
                            </p>
                        </div>
                    ) : (
                        <ul className="list-group">
                            {customCategories.map(cat => (
                                <li key={cat.id} className="list-group-item">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">

                                        <div>
                                            <strong>{cat.name}</strong>

                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                <span
                                                    className={`badge ${cat.type === "INCOME"
                                                        ? "bg-success"
                                                        : "bg-danger"
                                                        }`}
                                                >
                                                    {cat.type}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="btn btn-sm btn-danger mt-3 mt-md-0"
                                            onClick={() => deleteCategory(cat.id)}
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default Categories;
