/**
 * A functional component that renders a loading spinner.
 *
 * The spinner is centered both vertically and horizontally within the viewport.
 * It consists of a div with a border that animates with a spinning effect.
 *
 * @returns {JSX.Element} The JSX code for the loading spinner component.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="w-12 h-12 border-4 border-gray-200 border-t-[#ff8c00] rounded-full animate-spin"
        role="status"
      ></div>
    </div>
  );
}
