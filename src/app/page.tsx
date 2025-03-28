import ExpandingCard from "@/components/ExpandingCard"

import apollo13 from "../../public/story-images/apollo13.jpg"
import knight from "../../public/story-images/knight.jpg"

const cards = [
  {
    title: "The Last Shield: A Knight's Stand",
    description:
      "When the ancient dragon Malgrath descends upon the peaceful village of Oakendale, retired knight Sir Brannen takes up his rusted armor for one final battle to protect his home. Experience the journey of a broken hero who must rediscover his courage as he confronts impossible odds, devising a desperate plan that will determine the fate of everyone he holds dear.",
    image: knight,
    link: '/story'
  },
  {
    title: "The Apollo 13 Mission",
    description:
      "Apollo 13 was NASA's seventh crewed mission in the Apollo space program, launched on April 11, 1970.The spacecraft carried a crew of three astronauts: James Lovell, Jack Swigert, and Fred Haise. It was intended to be the third mission to land humans on the Moon. Fate had different plans.",
    image: apollo13,
    link: '/learn'
  }
]

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <ExpandingCard key={index} title={card.title} description={card.description} image={card.image} link={card.link} />
        ))}
      </div>
    </main>
  )
}

