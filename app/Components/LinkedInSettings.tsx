import React from "react";
import { useFormikContext } from "formik";

export function LinkedInSettings() {
  const { values, setFieldValue, handleChange, handleBlur, touched, errors } = useFormikContext<any>();
  const isCarousel = values.post_as_images_carousel;

  return (
    <div className="mb-[20px] bg-[var(--natural)] border border-[var(--border)] rounded-xl p-4 backdrop-blur-[12px]">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">LinkedIn Specific Settings</h3>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="post_as_images_carousel"
          name="post_as_images_carousel"
          checked={!!isCarousel}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-4 h-4 rounded text-[var(--secondary)] focus:ring-[var(--secondary)] bg-[var(--natural)] border-[var(--border)]"
        />
        <label htmlFor="post_as_images_carousel" className="text-sm text-[var(--primary)] cursor-pointer">
          Post as PDF document carousel
        </label>
      </div>

      {isCarousel && (
        <div className="mt-4">
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">Carousel slide name</label>
          <input
            type="text"
            name="carousel_name"
            value={values.carousel_name || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="slides"
            className="w-full bg-[var(--natural)] border border-[var(--border)] rounded-xl px-4 py-2 text-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] transition"
          />
        </div>
      )}
    </div>
  );
}
