import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import PublishDataTable from "@/app/[lang]/(pages)/(blogs)/blogs/publish-table";

const BlogsPage = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>All Published Blogs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <PublishDataTable/>
                </CardContent>
            </Card>

        </div>
    );
};

export default BlogsPage;