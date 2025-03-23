import ExpandingCard from "@/components/ExpandingCard"

import earhart from "../../public/story-images/earhart.jpg"

const cards = [
  {
    title: "Story 1",
    description:
      "Fiction.",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Wings Across the World: Amelia Earhart's Final Adventure",
    description:
      "Join Amelia Earhart on her daring 1937 attempt to circumnavigate the globe, from the Americas to South America, Africa, India, and finally to Lae, New Guinea. Experience the courage and determination that made her an aviation pioneer as she faces the challenges that would lead to one of history's greatest unsolved mysteries.",
    image: earhart,
  }
]

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <ExpandingCard key={index} title={card.title} description={card.description} image={card.image} />
        ))}
      </div>
    </main>
  )
}

