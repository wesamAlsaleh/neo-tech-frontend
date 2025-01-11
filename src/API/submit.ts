import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Handles an API request and sends back a JSON response with the request body data.
 *
 * @param {NextApiRequest} request - The incoming API request object.
 * @param {NextApiResponse} response - The outgoing API response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 *
 * @remarks
 * This function processes the incoming request by extracting the body data and sending it back as a JSON response.
 * After sending the JSON response, it performs a 301 redirect to the root URL ("/").
 *
 * @statusCodes
 * - 201: Created
 * - 200: OK
 * - 300: Multiple Choices
 * - 301: Moved Permanently
 * - 302: Found
 * - 303: See Other
 * - 304: Not Modified
 * - 307: Temporary Redirect
 * - 308: Permanent Redirect
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 500: Internal Server Error
 * - 501: Not Implemented
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * - 504: Gateway Timeout
 * - 505: HTTP Version Not Supported
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  // Handle the request
  const data = request.body;

  //   response.json({ data });

  // redirect
  response.redirect(301, "/");
}

// 201: Created, 200: OK, 300: Multiple Choices, 301: Moved Permanently, 302: Found, 303: See Other, 304: Not Modified, 307: Temporary Redirect, 308: Permanent Redirect, 400: Bad Request, 401: Unauthorized, 403: Forbidden, 404: Not Found, 500: Internal Server Error, 501: Not Implemented, 502: Bad Gateway, 503: Service Unavailable, 504: Gateway Timeout, 505: HTTP Version Not Supported
