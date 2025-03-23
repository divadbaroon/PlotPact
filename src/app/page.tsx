import ExpandingCard from "@/components/ExpandingCard"

const cards = [
  {
    title: "Story 1",
    description:
      "This is a longer description for Card 1. It contains more text to demonstrate the expanding effect when hovering over the card. You'll see the full content overlaying the image without causing any layout shifts. The card maintains its original size, but the content expands upwards.",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Story 2",
    description:
      "Card 2 also has a detailed description. When you hover over this card, you'll be able to read all of this text without disturbing the layout of other cards on the page. This demonstrates how we can show more content by overlaying it on top of the image.",
    image: "/placeholder.svg?height=200&width=400",
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

