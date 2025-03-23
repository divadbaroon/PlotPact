import Image from "next/image"
import Link from "next/link"

import { ExpandingCardProps } from "@/types"

export default function ExpandingCard({ title, description, image }: ExpandingCardProps) {
  return (
    <Link href="/story" className="block">
      <div
        className="relative overflow-hidden h-[500px] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 
                    hover:scale-[1.02] cursor-pointer border border-gray-200 hover:border-primary"
      >
        <div className="relative h-[250px]">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <div className="bg-white p-6 h-[250px] overflow-y-auto group-hover:bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-700">{description}</p>
        </div>
        <div className="absolute inset-0 bg-primary/0 hover:bg-primary/5 transition-colors duration-300"></div>
      </div>
    </Link>
  )
}

