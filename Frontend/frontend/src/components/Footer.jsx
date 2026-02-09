
export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Footer Content */}
                <div className="grid grid-cols-4 gap-8 mb-8">
                    {/* Column 1 */}
                    <div>
                        <h3 className="font-bold mb-4">Online Shopping</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Men</a></li>
                            <li><a href="#" className="hover:text-white">Women</a></li>
                            <li><a href="#" className="hover:text-white">Kids</a></li>
                            <li><a href="#" className="hover:text-white">Electronics</a></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white">Track Order</a></li>
                            <li><a href="#" className="hover:text-white">Returns</a></li>
                            <li><a href="#" className="hover:text-white">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h3 className="font-bold mb-4">About Us</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">About ShopHub</a></li>
                            <li><a href="#" className="hover:text-white">Careers</a></li>
                            <li><a href="#" className="hover:text-white">Blog</a></li>
                            <li><a href="#" className="hover:text-white">Press</a></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div>
                        <h3 className="font-bold mb-4">Connect</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white">Facebook</a></li>
                            <li><a href="#" className="hover:text-white">Instagram</a></li>
                            <li><a href="#" className="hover:text-white">Twitter</a></li>
                            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <p>&copy; 2024 ShopHub. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">Privacy Policy</a>
                            <a href="#" className="hover:text-white">Terms & Conditions</a>
                            <a href="#" className="hover:text-white">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
