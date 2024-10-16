"use client"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import BlogComponent from "@/components/blog";

const AddBlog = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Add Blog</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogComponent/>
                </CardContent>
            </Card>

        </div>
    );
};

export default AddBlog;