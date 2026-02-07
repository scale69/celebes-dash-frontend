import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCategory } from "@/lib/axios/actions/category/get";
import { Category, ChildrenCategory, ResultArtilce } from "@/types/data";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, Bookmark } from "lucide-react";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}


export default function FormCategory({ value, onChange }: CategorySelectProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategory
  })
  if (isLoading) return null
  if (!data) return null



  return (

    <div className="grid gap-2">
      <Label htmlFor="category">
        Category
      </Label>
      <Select key={value} value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent >
          <SelectGroup>
            <SelectItem value="umum" className="text-slate-700 dark:text-white text-xs">
              <Bookmark size={20} className="text-slate-600" />
              Umum
            </SelectItem>
          </SelectGroup>

          {data.map((category: Category) => (
            <div key={category.id}>
              {category.children.length > 0 && (
                <SelectGroup key={category.id} className="bg-zinc-50 dark:bg-zinc-900 rounded-md">
                  <SelectSeparator className="mx-2" />
                  <SelectLabel className="text-black dark:text-white flex flex-row items-center gap-2">
                    {category.name}
                    <ArrowDown size={10} />
                  </SelectLabel>
                  <div className="mx-2 border border-dashed mb-2" />
                  {category.children.map((children: ChildrenCategory) => (
                    <SelectItem key={children.id} className="text-slate-700 dark:text-white text-xs" value={children.slug}>
                      <Bookmark size={20} className="text-slate-600" />
                      {children.name}
                    </SelectItem>
                  ))}
                  <SelectSeparator className="mx-2" />
                </SelectGroup>
              )}
              <SelectGroup>
                <SelectItem key={category.id} className="uppercase" value={category.slug}>
                  <Bookmark size={20} className="text-slate-600" />
                  {category.name}
                </SelectItem>
              </SelectGroup>
            </div>
          ))}

        </SelectContent>
      </Select>
    </div>

  )
}