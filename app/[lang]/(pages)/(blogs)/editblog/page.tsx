"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import BlogComponent from "@/components/blog";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {BlogModel} from "@/models/blog";
import {blogService} from "@/app/api/services/blog.Service";

const EditBlog = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [blog, setBlog] = useState<BlogModel | null>(null);
    useEffect(() => {
        if (!id) {
            return;
        } else {
            blogService.getById(id).then((response) => {
                setBlog(response.data);
            })
        }
    }, [id]);
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Update Blog</CardTitle>
                </CardHeader>
                <CardContent>
                    {blog && (
                        <BlogComponent {...blog} />
                    )}
                </CardContent>
            </Card>

        </div>
    );
};

export default EditBlog;