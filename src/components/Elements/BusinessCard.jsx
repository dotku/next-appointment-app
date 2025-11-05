import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";

export default function BusinessCard({ business }) {
  // Use logo_url if exists, otherwise use default business avatar
  const logoSrc = business.logo_url || `https://avatar.iran.liara.run/public/boy?username=${business.name}`;

  return (
    <Card className="w-full mb-4">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={logoSrc}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {business.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {business.city}
            </h5>
          </div>
        </div>
      </CardHeader>
      
      {/* Description */}
      {business.description && (
        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>{business.description}</p>
        </CardBody>
      )}
      
      <CardFooter className="gap-3 flex-col items-start">
        {/* Address */}
        {business.address && (
          <div className="flex gap-2 items-center w-full">
            <svg 
              className="w-4 h-4 text-gray-500 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <p className="text-small text-default-600">
              {business.address}
            </p>
          </div>
        )}

        {/* Phone */}
        {business.phone && (
          <div className="flex gap-2 items-center w-full">
            <svg 
              className="w-4 h-4 text-gray-500 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
              />
            </svg>
            <a 
              href={`tel:${business.phone}`}
              className="text-small text-default-600 hover:text-blue-600 hover:underline"
            >
              {business.phone}
            </a>
          </div>
        )}

        {/* Calendly Link */}
        {business.calendly_url && (
          <div className="flex gap-2 items-center w-full">
            <svg 
              className="w-4 h-4 text-blue-500 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <a 
              href={business.calendly_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-blue-500 hover:text-blue-700 hover:underline break-all"
            >
              {business.calendly_url}
            </a>
          </div>
        )}

        {/* Website */}
        {business.website && (
          <div className="flex gap-2 items-center w-full">
            <svg 
              className="w-4 h-4 text-gray-500 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" 
              />
            </svg>
            <a 
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-blue-500 hover:text-blue-700 hover:underline break-all"
            >
              {business.website}
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

