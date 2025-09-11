import { PopularTags } from './popular-tags';
import { Recommendations } from './recommendations';
import { Search } from './search';

export function RightBar() {
    return (
        <div className="sticky top-0 flex h-max flex-col gap-4 pt-4">
            <Search />
            <PopularTags />
            <Recommendations />
            <div className="flex flex-wrap gap-x-4 text-sm text-textCustom">
                <span>© 2025</span>
            </div>
        </div>
    );
}
