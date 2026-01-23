import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card'; 
import {SquareArrowOutUpRight} from "lucide-react"
import { Button } from '@/components/ui/button';
const project_details = [
  {
    title: "KongaHub E-commerce App",
    description: "A full-featured e-commerce platform where users can browse products, add to cart, and checkout. Built with Node.js, Express.js, MongoDB, and EJS",
    image: "/images/orderbackground.jpg",
    price: '20',  
    rate:'5'
  },
  {
    title: "Flowline Social App",
    description :"A social networking app where users can create profiles, share posts, like, comment, and engage with others. Built with Next.js, MongoDB, Cloudinary, and Tailwind CSS.",
    image: "/images/orderbackground.jpg",
    price: '20', 
    rate:'2'
  },
  {
    title: "BookHive Library App",
    description: "A library management app to browse, reserve, and borrow books. Features JWT authentication, scheduled tasks, and cloud image storage. Built with React, Node.js, and Tailwind CSS.",
    image: "/images/orderbackground.jpg",
   price: '20',
   rate: '3'
  },
]
function Page() {
  return (
    <div>
      {/* Hero / Header */}
      <div className="relative w-full h-62 sm:h-70 md:h-76 overflow-hidden rounded-2xl shadow-2xl">
        <Image
          src="/images/orderbackground.jpg"
          alt="Food Order Image"
          fill
          className="object-cover"
          priority
        />

      </div>

      {/* Page content */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        <h3 className="font-medium mb-2">Filter</h3>
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {project_details.map((project, index) => (
                      <Card
                        key={index}
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative top-0 h-64 overflow-hidden">
                          {project.image && (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
            
                        {/* Content */}
                        <div className="p-4">
                          <h2 className="text-xl font-bold mb-2 text-black">{project.title}</h2>
                          <h3 className='text-gray-700'>{project.title}</h3>
                          <div>
                            ${project.price}
                            {project.rate}
                          </div>
                          <Button className='text-center w-full'>Cart</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
        </div>

    </div>
  );
}

export default Page;
