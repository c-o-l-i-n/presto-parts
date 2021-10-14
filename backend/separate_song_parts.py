import sys
import os
import PyPDF2

def seperate_song_parts(src_path, parts_list, prefix):
	# get list of part names and number of pages for each part
	# Format is shown below: part name followed by #num_pages (1 is default)
			
	"""
	Score #9
	Flute
	Clarinet #2
	Alto Saxophone
	etc ...
	"""

	if not os.path.exists(src_path):
		raise FileNotFoundError('The given PDF source file does not exist')
	
	if src_path[-4:].lower() != '.pdf':
		raise BaseException('The given PDF source file is not a PDF')

	num_pages_for_part = dict()
	pages_sum = 0
	for line in parts_list.splitlines():
		# split line into part name and number of pages
		part_name_and_num_pages = line.split("#")

		# remove spaces from part name
		part_name_and_num_pages[0] = part_name_and_num_pages[0].strip() \
			.replace(" ", "")

		# set default page number to 1 or convert page number from str to int
		if len(part_name_and_num_pages) < 2:
			part_name_and_num_pages.append(1)
		else:
			part_name_and_num_pages[1] = int(part_name_and_num_pages[1])

		# add part and its number of pages to dict
		num_pages_for_part[part_name_and_num_pages[0]] \
			= part_name_and_num_pages[1]

		# add to the total number of pages in document
		pages_sum += part_name_and_num_pages[1]


	# get PDF
	with open(src_path, "rb") as src_file:
		# create source PDF object
		src = PyPDF2.PdfFileReader(src_file)

		# make sure actual page # of src matches part names list
		if src.numPages != pages_sum:
			raise BaseException(f'Incorrect number of pages in Parts List. \
				PDF has {src.numPages} pages, but you listed {pages_sum}.')

		# create new folder with name of prefix
		source_file_directory = src_path[0:src_path.rfind('/')]
		os.chdir(source_file_directory)
		try:
			os.mkdir(prefix)
		except FileExistsError:
			raise FileExistsError(f'A folder named "{prefix}" already exists at the PDF location')
		os.chdir(prefix)

		# for each part
		starting_page = 0
		for part in num_pages_for_part.keys():
			# create destination PDF object
			dest = PyPDF2.PdfFileWriter()

			# get each page of part
			for i in range(0, num_pages_for_part[part]):
				page = src.getPage(starting_page + i)
				# flip even pages (odd here since indexing starts at 0)
				if i %2 == 1:
					page.rotateCounterClockwise(180)
				dest.addPage(page)
			starting_page += num_pages_for_part[part]

			# generate file name
			dest_file_name = "{}-{}.pdf".format(prefix, part)

			# export PDF
			with open(dest_file_name, "wb") as PDF_output:
				dest.write(PDF_output)
	
	return f'{source_file_directory}/{prefix}'

if __name__ == "__main__":
	# read cmd line args
	src_path = sys.argv[1]
	parts_list_path = sys.argv[2]
	prefix = sys.argv[3]

	with open(parts_list_path, 'r') as file:
		parts_list = file.read()

	seperate_song_parts(src_path. parts_list, prefix)
