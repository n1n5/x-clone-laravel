export function Search() {
    return (
        <div className="flex items-center gap-4 rounded-full bg-hoverCustom px-4 py-2">
            <img src="/icons/search.svg" alt="Search" width={16} height={16} />
            <input
                name="search"
                type="text"
                placeholder="Search"
                className="bg-transparent text-textDarkMode outline-none placeholder:text-textCustom"
            />
        </div>
    );
}
