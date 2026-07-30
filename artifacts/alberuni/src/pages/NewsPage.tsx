import { useState } from "react";
import { useListNews } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  "olimpiada",
  "tadbir",
  "sport",
  "fan",
  "madaniyat",
  "o'qituvchilar",
];

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { data, isLoading } = useListNews(
    { page, limit: 9, ...(category ? { category } : {}) },
    { query: { queryKey: ["news", page, category] } }
  );

  const totalPages = data ? Math.ceil(data.total / 9) : 1;

  return (
    <main className="min-h-screen bg-background">

      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            data-testid="text-page-title"
          >
            Yangiliklar
          </h1>

          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Olmazor ixtisoslashtirilgan maktab hayotidagi voqealar,
            olimpiadalar, tadbirlar va muhim yangiliklar
          </p>
        </div>
      </div>


      <div className="container mx-auto px-4 md:px-8 py-12">

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">

          <button
            onClick={() => {
              setCategory(undefined);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Barchasi
          </button>


          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}

        </div>



        {/* News Grid */}

        {isLoading ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[...Array(9)].map((_, i) => (

              <div
                key={i}
                className="rounded-xl overflow-hidden border bg-card"
              >
                <Skeleton className="h-52 w-full" />

                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

              </div>

            ))}

          </div>


        ) : !data?.items.length ? (

          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">
              Hozircha yangiliklar yo'q
            </p>
          </div>


        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


            {data.items.map((article) => (

              <Link key={article.id} href={`/news/${article.id}`}>

                <div
                  className="
                  bg-card 
                  rounded-xl 
                  overflow-hidden 
                  border 
                  shadow-sm 
                  hover:shadow-md 
                  transition-all 
                  h-full 
                  flex 
                  flex-col 
                  group 
                  cursor-pointer
                  "
                >


                  <div className="
                    relative 
                    h-52 
                    overflow-hidden 
                    bg-gradient-to-br 
                    from-primary/10 
                    to-secondary/40
                  ">


                    {article.imageUrl ? (

                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="
                        w-full 
                        h-full 
                        object-cover 
                        group-hover:scale-105 
                        transition-transform 
                        duration-500
                        "
                      />

                    ) : (

                      <div className="
                      w-full 
                      h-full 
                      flex 
                      items-center 
                      justify-center
                      text-center
                      px-3
                      ">

                        <span className="
                        text-primary/20 
                        text-3xl 
                        font-bold
                        ">
                          Olmazor<br/>
                          Ixtisoslashtirilgan<br/>
                          Maktabi
                        </span>

                      </div>

                    )}


                    <div className="absolute top-4 left-4">
                      <Badge className="uppercase text-xs tracking-wider">
                        {article.category}
                      </Badge>
                    </div>


                  </div>



                  <div className="p-6 flex-1 flex flex-col">


                    <div className="
                    flex 
                    items-center 
                    gap-2 
                    text-sm 
                    text-muted-foreground 
                    mb-3
                    ">

                      <Calendar className="h-4 w-4"/>

                      <time>
                        {format(
                          new Date(article.publishedAt),
                          "d MMMM, yyyy"
                        )}
                      </time>

                    </div>



                    <h3 className="
                    text-lg 
                    font-bold 
                    mb-2 
                    group-hover:text-primary 
                    transition-colors 
                    line-clamp-2
                    ">
                      {article.title}
                    </h3>



                    <p className="
                    text-muted-foreground 
                    text-sm 
                    line-clamp-3 
                    mb-4 
                    flex-1
                    ">
                      {article.excerpt}
                    </p>



                    <span className="
                    text-primary 
                    font-medium 
                    text-sm 
                    flex 
                    items-center 
                    gap-1 
                    mt-auto
                    ">

                      Ko'proq o'qish

                      <ArrowRight className="h-4 w-4"/>

                    </span>


                  </div>


                </div>


              </Link>

            ))}


          </div>

        )}




        {/* Pagination */}

        {totalPages > 1 && (

          <div className="flex justify-center gap-2 mt-12">


            <Button
              variant="outline"
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
              disabled={page === 1}
            >
              Oldingi
            </Button>



            {[...Array(totalPages)].map((_, i) => (

              <Button
                key={i + 1}
                variant={
                  page === i + 1
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setPage(i + 1)
                }
              >
                {i + 1}
              </Button>

            ))}



            <Button
              variant="outline"
              onClick={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={page === totalPages}
            >
              Keyingi
            </Button>


          </div>

        )}


      </div>

    </main>
  );
}