import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import DraftDataTable from "@/app/[lang]/(pages)/(blogs)/draft/draft-table";

const DraftPage = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>All Draft Blogs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DraftDataTable/>
                </CardContent>
            </Card>

        </div>
    );
};

export default DraftPage;